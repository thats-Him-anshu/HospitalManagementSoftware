"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import AppointmentModal from "@/components/admin/AppointmentModal";
import { format } from "date-fns";

export default function ReceptionAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptRes, patRes, docRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/patients"),
        fetch("/api/users?role=doctor"),
      ]);
      const aptData = await aptRes.json();
      const patData = await patRes.json();
      const docData = await docRes.json();
      if (aptData.success) setAppointments(aptData.data);
      if (patData.success) setPatients(patData.data);
      if (docData.success) setDoctors(docData.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-text">Appointments</h2>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Book Appointment</Button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Patient</th>
                <th className="px-6 py-4 font-medium text-text-muted">Doctor</th>
                <th className="px-6 py-4 font-medium text-text-muted">Date & Time</th>
                <th className="px-6 py-4 font-medium text-text-muted">Type</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">Loading...</td></tr> :
              appointments.length === 0 ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">No appointments.</td></tr> :
              appointments.map(a => (
                <tr key={a._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{a.patient?.firstName} {a.patient?.lastName}</td>
                  <td className="px-6 py-4 text-text-muted">{a.doctor?.name || "-"}</td>
                  <td className="px-6 py-4 text-text-muted">{format(new Date(a.appointmentDate), "dd MMM yyyy")} • {a.timeSlot}</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">{a.type}</span></td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs capitalize font-medium ${a.status === "completed" ? "bg-green-100 text-green-700" : a.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchData} patients={patients} doctors={doctors} />
    </div>
  );
}
