"use client";

import { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Plus, List, Calendar as CalendarIcon, Check, X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import AppointmentModal from "@/components/admin/AppointmentModal";
import { format } from "date-fns";

const localizer = momentLocalizer(moment);

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrerequisites = async () => {
    try {
      const [pRes, dRes] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/users?role=doctor")
      ]);
      const pData = await pRes.json();
      let dData = { success: false, data: [] };
      try { dData = await dRes.json(); } catch(e){}
      
      if (pData.success) setPatients(pData.data.filter((p:any) => p.isActive));
      if (dData.success) setDoctors(dData.data);
      if (!dData.success || dData.data.length === 0) {
        setDoctors([{ _id: "dummy-doctor", name: "Nidarsin", speciality: "BNYS" }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPrerequisites();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  // Convert appointments to react-big-calendar format
  const calendarEvents = appointments.map(apt => {
    const start = new Date(apt.appointmentDate);
    // Parse timeSlot "10:30 AM" into start date hours
    const [time, modifier] = apt.timeSlot.split(' ');
    const parts = time.split(':');
    let hours = parts[0];
    const minutes = parts[1];
    
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    start.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30); // Assume 30 min slots for calendar

    return {
      id: apt._id,
      title: `${apt.patient?.firstName} (${apt.type}) - Dr. ${apt.doctor?.name}`,
      start,
      end,
      resource: apt,
    };
  });

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Appointments</h2>
          <p className="text-sm text-text-muted mt-1">Schedule and manage consultations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-surface rounded-md p-1 border border-border">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded text-sm flex items-center transition-colors ${viewMode === "list" ? "bg-white shadow-sm font-medium text-text" : "text-text-muted hover:text-text"}`}
            >
              <List className="h-4 w-4 mr-1" /> List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-1.5 rounded text-sm flex items-center transition-colors ${viewMode === "calendar" ? "bg-white shadow-sm font-medium text-text" : "text-text-muted hover:text-text"}`}
            >
              <CalendarIcon className="h-4 w-4 mr-1" /> Calendar
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Book Appointment
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-white rounded-lg border border-border shadow-sm p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">Loading appointments...</div>
        ) : viewMode === "calendar" ? (
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            defaultView="week"
            eventPropGetter={(event) => ({
              className: `border-l-4 rounded-md shadow-sm px-1 py-0.5 text-xs font-medium text-white ${
                event.resource.status === 'scheduled' ? 'bg-blue-500 border-blue-700' :
                event.resource.status === 'confirmed' ? 'bg-purple-500 border-purple-700' :
                event.resource.status === 'completed' ? 'bg-green-500 border-green-700' :
                'bg-red-500 border-red-700'
              }`
            })}
          />
        ) : (
          <div className="overflow-x-auto h-full overflow-y-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface border-b border-border sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-medium text-text-muted">Date & Time</th>
                  <th className="px-6 py-4 font-medium text-text-muted">Patient</th>
                  <th className="px-6 py-4 font-medium text-text-muted">Doctor</th>
                  <th className="px-6 py-4 font-medium text-text-muted">Type</th>
                  <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                  <th className="px-6 py-4 font-medium text-text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-text-muted">No appointments found.</td></tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-text">{format(new Date(apt.appointmentDate), "dd MMM yyyy")}</span>
                        <div className="text-text-muted text-xs mt-0.5">{apt.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-primary">{apt.patient?.firstName} {apt.patient?.lastName}</span>
                        <div className="text-text-muted text-xs mt-0.5">{apt.patient?.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-text-muted">Dr. {apt.doctor?.name}</td>
                      <td className="px-6 py-4 text-text-muted">{apt.type}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                          ${apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                            apt.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                            apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }
                        `}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {apt.status === "scheduled" && (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleStatusUpdate(apt._id, "confirmed")} className="text-success hover:bg-success/10 p-1.5 rounded transition-colors" title="Confirm">
                              <Check className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleStatusUpdate(apt._id, "cancelled")} className="text-danger hover:bg-danger/10 p-1.5 rounded transition-colors" title="Cancel">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {apt.status === "confirmed" && (
                          <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(apt._id, "completed")}>
                            Mark Completed
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchAppointments}
        patients={patients}
        doctors={doctors}
      />
    </div>
  );
}
