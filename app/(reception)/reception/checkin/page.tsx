"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { LogIn, LogOut, Search } from "lucide-react";
import { format } from "date-fns";

export default function CheckInPage() {
  const [search, setSearch] = useState("");
  const [patient, setPatient] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [log, setLog] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    setPatient(null);
    setMessage("");
    try {
      const res = await fetch(`/api/patients`);
      const data = await res.json();
      if (data.success) {
        const q = search.toLowerCase();
        const found = data.data.find((p: any) =>
          p.patientId.toLowerCase() === q || p.phone === search || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
        );
        if (found) setPatient(found);
        else setMessage("No patient found with that ID, phone, or name.");
      }
    } catch (e) { console.error(e); }
    finally { setSearching(false); }
  };

  const handleAction = (action: "check-in" | "check-out") => {
    const now = new Date();
    setLog(prev => [{ patient: `${patient.firstName} ${patient.lastName}`, patientId: patient.patientId, action, time: now }, ...prev]);
    setMessage(`${patient.firstName} ${patient.lastName} ${action === "check-in" ? "checked in" : "checked out"} at ${format(now, "hh:mm a")}`);
    setPatient(null);
    setSearch("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">Patient Check-In / Check-Out</h2>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-3 max-w-xl">
            <input type="text" placeholder="Search by Patient ID, Phone, or Name..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} className="flex-1 h-12 rounded-md border border-border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50" />
            <Button onClick={handleSearch} isLoading={searching} className="h-12"><Search className="mr-2 h-4 w-4" /> Search</Button>
          </div>
          {message && <p className="mt-3 text-sm text-green-600 font-medium">{message}</p>}
        </CardContent>
      </Card>

      {patient && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{patient.firstName} {patient.lastName}</h3>
                <p className="text-sm text-text-muted">{patient.patientId} • {patient.phone} • {patient.admissionType || "OP"}</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => handleAction("check-in")} className="bg-green-600 hover:bg-green-700"><LogIn className="mr-2 h-4 w-4" /> Check In</Button>
                <Button onClick={() => handleAction("check-out")} variant="outline"><LogOut className="mr-2 h-4 w-4" /> Check Out</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {log.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Today&apos;s Check-In/Out Log</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {log.map((entry, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-surface">
                  <div>
                    <span className="font-medium">{entry.patient}</span>
                    <span className="text-xs text-text-muted ml-2">{entry.patientId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${entry.action === "check-in" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{entry.action === "check-in" ? "Checked In" : "Checked Out"}</span>
                    <span className="text-xs text-text-muted font-mono">{format(entry.time, "hh:mm a")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
