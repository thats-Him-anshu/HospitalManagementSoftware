"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { CalendarCheck, Download, Users } from "lucide-react";
import * as XLSX from "xlsx";

export default function AttendancePage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [staffRes, attRes] = await Promise.all([
        fetch("/api/users"),
        fetch(`/api/attendance?month=${selectedMonth}&year=${selectedYear}`)
      ]);
      const staffData = await staffRes.json();
      const attData = await attRes.json();

      if (staffData.success) {
        setStaff(staffData.data.filter((u: any) => u.isActive));
      }
      if (attData.success) {
        setAttendance(attData.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [selectedMonth, selectedYear]);

  const handleMarkAttendance = async (userId: string, status: string) => {
    try {
      const record = attendance.find(a => a.user._id === userId && isSameDay(new Date(a.date), new Date(selectedDate)));
      
      const payload = {
        user: userId,
        date: selectedDate,
        status,
        checkIn: status === "Present" && !record?.checkIn ? new Date().toISOString() : record?.checkIn,
        checkOut: status === "Present" && record?.checkIn && !record?.checkOut ? new Date().toISOString() : record?.checkOut,
      };

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        // Refresh attendance data
        const attRes = await fetch(`/api/attendance?month=${selectedMonth}&year=${selectedYear}`);
        const attData = await attRes.json();
        if (attData.success) setAttendance(attData.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const exportToExcel = () => {
    if (viewMode === "daily") {
      const exportData = staff.map(user => {
        const record = attendance.find(a => a.user._id === user._id && isSameDay(new Date(a.date), new Date(selectedDate)));
        return {
          "Name": user.name,
          "Role": user.role,
          "Status": record?.status || "Not Marked",
          "Check In": record?.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "-",
          "Check Out": record?.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "-"
        };
      });
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Daily Attendance");
      XLSX.writeFile(wb, `Attendance_${selectedDate}.xlsx`);
    } else {
      const monthStart = new Date(selectedYear, selectedMonth - 1, 1);
      const monthEnd = new Date(selectedYear, selectedMonth, 0);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

      const exportData = staff.map(user => {
        const row: any = { Name: user.name, Role: user.role };
        days.forEach(day => {
          const record = attendance.find(a => a.user._id === user._id && isSameDay(new Date(a.date), day));
          row[format(day, "dd MMM")] = record?.status || "-";
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Monthly Attendance");
      XLSX.writeFile(wb, `Monthly_Attendance_${selectedMonth}_${selectedYear}.xlsx`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Staff Attendance</h2>
          <p className="text-sm text-text-muted mt-1">Track check-ins and monthly records</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-surface rounded-md p-1 border border-border">
            <button
              onClick={() => setViewMode("daily")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === "daily" ? "bg-white shadow-sm text-text" : "text-text-muted hover:text-text"}`}
            >
              Daily Register
            </button>
            <button
              onClick={() => setViewMode("monthly")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === "monthly" ? "bg-white shadow-sm text-text" : "text-text-muted hover:text-text"}`}
            >
              Monthly View
            </button>
          </div>
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card className="p-4 flex gap-4 items-center bg-surface border-border">
        {viewMode === "daily" ? (
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Select Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        ) : (
          <div className="flex gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Month</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:ring-primary outline-none"
              >
                {Array.from({length: 12}).map((_, i) => (
                  <option key={i+1} value={i+1}>{format(new Date(2000, i, 1), "MMMM")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Year</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:ring-primary outline-none"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-text-muted">Loading attendance data...</div>
        ) : viewMode === "daily" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium text-text-muted">Staff Member</th>
                  <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                  <th className="px-6 py-4 font-medium text-text-muted">Check In</th>
                  <th className="px-6 py-4 font-medium text-text-muted">Check Out</th>
                  <th className="px-6 py-4 font-medium text-text-muted text-right">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staff.map((user) => {
                  const record = attendance.find(a => a.user._id === user._id && isSameDay(new Date(a.date), new Date(selectedDate)));
                  
                  return (
                    <tr key={user._id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-text">{user.name}</div>
                        <div className="text-xs text-text-muted capitalize">{user.role}</div>
                      </td>
                      <td className="px-6 py-4">
                        {record?.status ? (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${record.status === 'Present' ? 'bg-success/10 text-success' : 
                              record.status === 'Absent' ? 'bg-danger/10 text-danger' : 
                              'bg-primary/10 text-primary'}
                          `}>
                            {record.status}
                          </span>
                        ) : (
                          <span className="text-text-muted text-xs italic">Not Marked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-text-muted font-mono text-xs">
                        {record?.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "-"}
                      </td>
                      <td className="px-6 py-4 text-text-muted font-mono text-xs">
                        {record?.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          className="h-8 rounded border border-border bg-white text-xs px-2 focus:outline-none"
                          value={record?.status || ""}
                          onChange={(e) => handleMarkAttendance(user._id, e.target.value)}
                        >
                          <option value="" disabled>Select Status</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                          <option value="Half-Day">Half-Day</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium text-text-muted sticky left-0 bg-surface z-10 border-r border-border min-w-[200px]">Staff Member</th>
                  {eachDayOfInterval({ 
                    start: new Date(selectedYear, selectedMonth - 1, 1), 
                    end: new Date(selectedYear, selectedMonth, 0) 
                  }).map(day => (
                    <th key={day.toISOString()} className="px-2 py-3 font-medium text-text-muted text-center text-xs w-10">
                      {format(day, "dd")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staff.map((user) => (
                  <tr key={user._id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-surface/50 border-r border-border z-10 transition-colors">
                      <div className="font-medium text-text truncate max-w-[180px]">{user.name}</div>
                    </td>
                    {eachDayOfInterval({ 
                      start: new Date(selectedYear, selectedMonth - 1, 1), 
                      end: new Date(selectedYear, selectedMonth, 0) 
                    }).map(day => {
                      const record = attendance.find(a => a.user._id === user._id && isSameDay(new Date(a.date), day));
                      
                      let bgColor = "";
                      if (record?.status === "Present") bgColor = "bg-success/20";
                      else if (record?.status === "Absent") bgColor = "bg-danger/20";
                      else if (record?.status === "Leave") bgColor = "bg-yellow-200";
                      else if (record?.status === "Half-Day") bgColor = "bg-blue-200";

                      return (
                        <td key={day.toISOString()} className="px-1 py-2 text-center border-r border-border/50">
                          <div className={`h-6 w-full rounded-sm ${bgColor} flex items-center justify-center`} title={record?.status || "Not Marked"}>
                            <span className="text-[10px] font-medium opacity-60">
                              {record?.status ? record.status.charAt(0) : ""}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
