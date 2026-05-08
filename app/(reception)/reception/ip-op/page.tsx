"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import AdmissionModal from "@/components/admin/AdmissionModal";
import { format } from "date-fns";

export default function ReceptionIPOPPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const [admRes, patRes, docRes, roomRes] = await Promise.all([
        fetch("/api/admissions"),
        fetch("/api/patients"),
        fetch("/api/users?role=doctor"),
        fetch("/api/rooms"),
      ]);
      const admData = await admRes.json();
      const patData = await patRes.json();
      const docData = await docRes.json();
      const roomData = await roomRes.json();
      if (admData.success) setAdmissions(admData.data);
      if (patData.success) setPatients(patData.data);
      if (docData.success) setDoctors(docData.data);
      if (roomData.success) setRooms(roomData.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAdmissions(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-text">IP/OP Admissions</h2>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> New Admission</Button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Patient</th>
                <th className="px-6 py-4 font-medium text-text-muted">Type</th>
                <th className="px-6 py-4 font-medium text-text-muted">Date</th>
                <th className="px-6 py-4 font-medium text-text-muted">Doctor</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">Loading...</td></tr> :
              admissions.length === 0 ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">No admissions.</td></tr> :
              admissions.map(a => (
                <tr key={a._id} className="hover:bg-surface/50">
                  <td className="px-6 py-4 font-medium">{a.patient?.firstName} {a.patient?.lastName}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${a.admissionType === "IP" ? "bg-purple-100 text-purple-700" : "bg-teal-100 text-teal-700"}`}>{a.admissionType}</span></td>
                  <td className="px-6 py-4 text-text-muted">{format(new Date(a.admissionDate), "dd MMM yyyy")}</td>
                  <td className="px-6 py-4 text-text-muted">{a.admittingDoctor?.name || "-"}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${a.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchAdmissions} patients={patients} doctors={doctors} rooms={rooms} />
    </div>
  );
}
