"use client";

import { useEffect, useState } from "react";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import Link from "next/link";

export default function ReceptionPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function f() {
      try {
        const res = await fetch("/api/patients");
        const data = await res.json();
        if (data.success) setPatients(data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    f();
  }, []);

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    return `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q) || p.phone.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-text">Patients</h2>
        <Link href="/reception/patients/new"><Button><Plus className="mr-2 h-4 w-4" /> Register Patient</Button></Link>
      </div>
      <input type="text" placeholder="Search by name, ID, or phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-md border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Patient ID</th>
                <th className="px-6 py-4 font-medium text-text-muted">Name</th>
                <th className="px-6 py-4 font-medium text-text-muted">Age / Gender</th>
                <th className="px-6 py-4 font-medium text-text-muted">Phone</th>
                <th className="px-6 py-4 font-medium text-text-muted">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">Loading...</td></tr> :
              filtered.length === 0 ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">No patients found.</td></tr> :
              filtered.map(p => (
                <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{p.patientId}</td>
                  <td className="px-6 py-4 font-medium">{p.firstName} {p.lastName}</td>
                  <td className="px-6 py-4 text-text-muted">{p.age} / {p.gender}</td>
                  <td className="px-6 py-4">{p.phone}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${p.admissionType === "IP" ? "bg-purple-100 text-purple-700" : "bg-teal-100 text-teal-700"}`}>{p.admissionType || "OP"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
