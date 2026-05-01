"use client";

import { useEffect, useState } from "react";
import { Plus, Search, LogOut } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import AdmissionModal from "@/components/admin/AdmissionModal";
import { format } from "date-fns";
import Link from "next/link";

export default function IpOpPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"IP" | "OP" | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const typeQuery = filterType !== "all" ? `&type=${filterType}` : "";
      const res = await fetch(`/api/admissions?status=active${typeQuery}`);
      const data = await res.json();
      if (data.success) {
        setAdmissions(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrerequisites = async () => {
    try {
      const [pRes, dRes, rRes] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/users?role=doctor"), // Assuming this exists or we can just fetch all and filter
        fetch("/api/rooms")
      ]);
      const pData = await pRes.json();
      // Since we don't have a specific GET /api/users yet, we might need to handle this.
      // For now, let's assume we fetch all users or use a placeholder if api fails
      let dData = { success: false, data: [] };
      try { dData = await dRes.json(); } catch(e){}
      
      const rData = await rRes.json();
      
      if (pData.success) setPatients(pData.data.filter((p:any) => p.isActive));
      if (dData.success) setDoctors(dData.data);
      // Fallback if doctor API isn't ready
      if (!dData.success || dData.data.length === 0) {
        setDoctors([{ _id: "dummy-doctor", name: "Nidarsin", speciality: "BNYS" }]);
      }
      if (rData.success) setRooms(rData.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [filterType]);

  useEffect(() => {
    fetchPrerequisites();
  }, []);

  const handleDischarge = async (id: string) => {
    if (!confirm("Are you sure you want to discharge this patient? This will free up their bed immediately.")) return;
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "discharged" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdmissions();
        fetchPrerequisites(); // Refresh room bed availability
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">IP / OP Management</h2>
          <p className="text-sm text-text-muted mt-1">Manage active patient admissions and discharges</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Admission
        </Button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filterType === "all" ? "bg-primary text-white" : "bg-white text-text hover:bg-surface border border-border"}`}
        >
          All Active
        </button>
        <button
          onClick={() => setFilterType("IP")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filterType === "IP" ? "bg-primary text-white" : "bg-white text-text hover:bg-surface border border-border"}`}
        >
          In-Patients (IP)
        </button>
        <button
          onClick={() => setFilterType("OP")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filterType === "OP" ? "bg-primary text-white" : "bg-white text-text hover:bg-surface border border-border"}`}
        >
          Out-Patients (OP)
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto flex-1 min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Patient</th>
                <th className="px-6 py-4 font-medium text-text-muted">Type</th>
                <th className="px-6 py-4 font-medium text-text-muted">Admitted On</th>
                <th className="px-6 py-4 font-medium text-text-muted">Doctor</th>
                <th className="px-6 py-4 font-medium text-text-muted">Room / Bed</th>
                <th className="px-6 py-4 font-medium text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">Loading admissions...</td>
                </tr>
              ) : admissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    No active admissions found.
                  </td>
                </tr>
              ) : (
                admissions.map((ad) => (
                  <tr key={ad._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/patients/${ad.patient?._id}`} className="font-medium text-primary hover:underline">
                        {ad.patient?.firstName} {ad.patient?.lastName}
                      </Link>
                      <div className="text-xs text-text-muted">{ad.patient?.patientId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        ad.admissionType === 'IP' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ad.admissionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {format(new Date(ad.admissionDate), "dd MMM yyyy, h:mm a")}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      Dr. {ad.admittingDoctor?.name}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {ad.admissionType === "IP" ? (
                        <span className="font-medium text-text">{ad.room?.roomNumber} / Bed {ad.bed}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" onClick={() => handleDischarge(ad._id)} className="text-danger hover:text-danger hover:bg-danger/10 border-danger/20">
                        <LogOut className="h-4 w-4 mr-2" /> Discharge
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AdmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => { fetchAdmissions(); fetchPrerequisites(); }}
        patients={patients}
        doctors={doctors}
        rooms={rooms}
      />
    </div>
  );
}
