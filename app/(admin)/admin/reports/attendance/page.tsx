"use client";

import { useState, useEffect } from "react";

interface AttendanceRecord {
  _id: string;
  staffName: string;
  role: string;
  date: string;
  status: "Present" | "Absent" | "Leave" | "Half-Day";
  checkIn?: string;
  checkOut?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AttendanceReportPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const start = new Date(selectedYear, selectedMonth, 1).toISOString().split("T")[0];
      const end = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split("T")[0];
      const res = await fetch(`/api/attendance?start=${start}&end=${end}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : data.records ?? []);
      } else {
        setRecords([]);
      }
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const summary = {
    present: records.filter((r) => r.status === "Present").length,
    absent: records.filter((r) => r.status === "Absent").length,
    leave: records.filter((r) => r.status === "Leave").length,
    halfDay: records.filter((r) => r.status === "Half-Day").length,
  };

  const summaryCards = [
    { label: "Total Present", value: summary.present, color: "text-green-700 bg-green-50" },
    { label: "Total Absent", value: summary.absent, color: "text-red-700 bg-red-50" },
    { label: "On Leave", value: summary.leave, color: "text-amber-700 bg-amber-50" },
    { label: "Half-Day", value: summary.halfDay, color: "text-blue-700 bg-blue-50" },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Present: "bg-green-100 text-green-800",
      Absent: "bg-red-100 text-red-800",
      Leave: "bg-amber-100 text-amber-800",
      "Half-Day": "bg-blue-100 text-blue-800",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  const yearOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Attendance Report</h1>
          <p className="text-text-muted text-sm mt-1">Staff attendance overview for the selected month</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-text shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-text shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-border shadow-soft p-5"
          >
            <p className="text-text-muted text-sm">{card.label}</p>
            <p className={`text-3xl font-display font-bold mt-1 ${card.color.split(" ")[0]}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-display font-semibold text-text">Attendance Records</h2>
          <p className="text-text-muted text-xs mt-0.5">
            {MONTHS[selectedMonth]} {selectedYear} &middot; {records.length} records
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 text-text-muted text-sm">
            No attendance records found for this period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-text-muted text-left">
                  <th className="px-6 py-3 font-medium">Staff Name</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Check In</th>
                  <th className="px-6 py-3 font-medium">Check Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-3 text-text font-medium">{r.staffName}</td>
                    <td className="px-6 py-3 text-text-muted capitalize">{r.role}</td>
                    <td className="px-6 py-3 text-text-muted">
                      {new Date(r.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3">{statusBadge(r.status)}</td>
                    <td className="px-6 py-3 text-text-muted">{r.checkIn ?? "—"}</td>
                    <td className="px-6 py-3 text-text-muted">{r.checkOut ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
