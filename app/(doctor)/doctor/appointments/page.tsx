"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/shared/Card";
import { format } from "date-fns";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments?scope=mine");
      const data = await res.json();
      if (data.success) setAppointments(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchAppointments();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">My Appointments</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Patient</th>
                <th className="px-6 py-4 font-medium text-text-muted">Date & Time</th>
                <th className="px-6 py-4 font-medium text-text-muted">Type</th>
                <th className="px-6 py-4 font-medium text-text-muted">Chief Complaint</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-text-muted">Loading...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-text-muted">No appointments found.</td></tr>
              ) : appointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text">{apt.patient?.firstName} {apt.patient?.lastName}</td>
                  <td className="px-6 py-4 text-text-muted">{format(new Date(apt.appointmentDate), "dd MMM yyyy")} • {apt.timeSlot}</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">{apt.type}</span></td>
                  <td className="px-6 py-4 text-text-muted max-w-[200px] truncate">{apt.chiefComplaint || "-"}</td>
                  <td className="px-6 py-4">
                    <select value={apt.status} onChange={(e) => handleStatusChange(apt._id, e.target.value)} className="h-8 rounded border border-border bg-white text-xs px-2 focus:outline-none">
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
