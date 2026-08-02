"use client";

import { useState, useEffect } from "react";

interface StaffPerformance {
  _id: string;
  name: string;
  role: string;
  metric1Label: string;
  metric1Value: number;
  metric2Label: string;
  metric2Value: number;
}

interface UserRecord {
  _id: string;
  name: string;
  role: string;
  appointmentsCompleted?: number;
  treatmentPlansCreated?: number;
  therapySessionsCompleted?: number;
  therapySessionsScheduled?: number;
  patientsRegistered?: number;
  invoicesCreated?: number;
  leadsHandled?: number;
  leadsConverted?: number;
}

function getDateRange(offset: number = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function mapUserToPerformance(user: UserRecord): StaffPerformance {
  const role = (user.role ?? "").toLowerCase();

  if (role === "doctor") {
    return {
      _id: user._id,
      name: user.name,
      role: user.role,
      metric1Label: "Appointments Completed",
      metric1Value: user.appointmentsCompleted ?? 0,
      metric2Label: "Treatment Plans Created",
      metric2Value: user.treatmentPlansCreated ?? 0,
    };
  }
  if (role === "therapist") {
    return {
      _id: user._id,
      name: user.name,
      role: user.role,
      metric1Label: "Sessions Completed",
      metric1Value: user.therapySessionsCompleted ?? 0,
      metric2Label: "Sessions Scheduled",
      metric2Value: user.therapySessionsScheduled ?? 0,
    };
  }
  if (role === "receptionist") {
    return {
      _id: user._id,
      name: user.name,
      role: user.role,
      metric1Label: "Patients Registered",
      metric1Value: user.patientsRegistered ?? 0,
      metric2Label: "Invoices Created",
      metric2Value: user.invoicesCreated ?? 0,
    };
  }
  if (role === "telecaller") {
    return {
      _id: user._id,
      name: user.name,
      role: user.role,
      metric1Label: "Leads Handled",
      metric1Value: user.leadsHandled ?? 0,
      metric2Label: "Leads Converted",
      metric2Value: user.leadsConverted ?? 0,
    };
  }

  return {
    _id: user._id,
    name: user.name,
    role: user.role,
    metric1Label: "—",
    metric1Value: 0,
    metric2Label: "—",
    metric2Value: 0,
  };
}

export default function PerformanceReportPage() {
  const defaults = getDateRange();
  const [startDate, setStartDate] = useState(defaults.start);
  const [endDate, setEndDate] = useState(defaults.end);
  const [staff, setStaff] = useState<StaffPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?start=${startDate}&end=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        const users: UserRecord[] = Array.isArray(data) ? data : data.users ?? [];
        setStaff(users.map(mapUserToPerformance));
      } else {
        setStaff([]);
      }
    } catch {
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = roleFilter === "all"
    ? staff
    : staff.filter((s) => s.role.toLowerCase() === roleFilter);

  const roles = ["all", ...Array.from(new Set(staff.map((s) => s.role.toLowerCase())))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Performance Report</h1>
          <p className="text-text-muted text-sm mt-1">Staff performance metrics by role</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border shadow-soft p-5 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text capitalize focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {roles.map((r) => (
              <option key={r} value={r} className="capitalize">
                {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: filtered.length, icon: "👥" },
          { label: "Doctors", value: staff.filter((s) => s.role.toLowerCase() === "doctor").length, icon: "🩺" },
          { label: "Therapists", value: staff.filter((s) => s.role.toLowerCase() === "therapist").length, icon: "💆" },
          { label: "Support Staff", value: staff.filter((s) => ["receptionist", "telecaller"].includes(s.role.toLowerCase())).length, icon: "📋" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-border shadow-soft p-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{card.icon}</span>
              <p className="text-text-muted text-sm">{card.label}</p>
            </div>
            <p className="text-3xl font-display font-bold text-text mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-display font-semibold text-text">Staff Performance</h2>
          <p className="text-text-muted text-xs mt-0.5">
            {filtered.length} staff members &middot; {startDate} to {endDate}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-text-muted text-sm">
            No staff records found for the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-text-muted text-left">
                  <th className="px-6 py-3 font-medium">Staff Name</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Key Metric 1</th>
                  <th className="px-6 py-3 font-medium">Key Metric 2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-3 text-text font-medium">{s.name}</td>
                    <td className="px-6 py-3">
                      <span className="inline-block rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium capitalize">
                        {s.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-text">
                      <div>
                        <span className="font-semibold">{s.metric1Value}</span>
                        <span className="text-text-muted text-xs ml-1.5">{s.metric1Label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-text">
                      <div>
                        <span className="font-semibold">{s.metric2Value}</span>
                        <span className="text-text-muted text-xs ml-1.5">{s.metric2Label}</span>
                      </div>
                    </td>
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
