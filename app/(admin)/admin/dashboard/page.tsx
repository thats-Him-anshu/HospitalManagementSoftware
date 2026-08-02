"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar, Users, Building2, AlertCircle, Activity, Award,
  RefreshCw, Clock, UserCheck, ChevronRight, TrendingUp,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const ROLE_COLORS: Record<string, string> = {
  admin: "#6B7280",
  doctor: "#3B82F6",
  receptionist: "#14B8A6",
  therapist: "#22C55E",
  telecaller: "#A855F7",
  pharmacy: "#F97316",
};

const STATUS_BADGES: Record<string, { bg: string; text: string }> = {
  green: { bg: "bg-green-100 text-green-800", text: "In Consultation" },
  blue: { bg: "bg-blue-100 text-blue-800", text: "Available" },
  orange: { bg: "bg-orange-100 text-orange-800", text: "Patient Waiting" },
};

const PIE_COLORS = ["#4A6741", "#8B7355", "#C8A96E", "#5A8A4A", "#D4882A"];

const ACTIVITY_ICONS: Record<string, string> = {
  doctor: "🔵",
  therapist: "🟢",
  receptionist: "🩵",
  telecaller: "🟣",
  pharmacy: "🟠",
  admin: "⚪",
};

interface DashboardData {
  bookingsToday: number;
  activeIP: number;
  activeOP: number;
  pendingLeads: number;
  doctorOps: Array<Record<string, unknown>>;
  doctorLeaderboard: Array<Record<string, unknown>>;
  therapistOps: Array<Record<string, unknown>>;
  therapistLeaderboard: Array<Record<string, unknown>>;
  staffAttendance: Array<Record<string, unknown>>;
  activityFeed: Array<Record<string, unknown>>;
  topProducts: Array<{ name: string; value: number }>;
  topTreatments: Array<{ name: string; value: number }>;
  totalPatients: number;
  todayRevenue: number;
  monthRevenue: number;
  chartData: Array<{ name: string; revenue: number; expenses: number }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return <div className="text-center py-20 text-text-muted">Failed to load dashboard data.</div>;

  const statCards = [
    { label: "Total Bookings Today", value: data.bookingsToday, icon: Calendar, color: "text-blue-600 bg-blue-50" },
    { label: "Today's IP Patients", value: data.activeIP, icon: Building2, color: "text-green-600 bg-green-50" },
    { label: "Today's OP Patients", value: data.activeOP, icon: Users, color: "text-purple-600 bg-purple-50" },
    { label: "Pending Requests", value: data.pendingLeads, icon: AlertCircle, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-text">Admin Dashboard</h1>
        <button onClick={fetchData} className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-border p-5 shadow-soft hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </div>
            <div className="text-2xl font-bold text-text">{card.value}</div>
            <div className="text-sm text-text-muted mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Row 2: Doctor Ops + Leaderboard */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-text">Live Doctor Operations</h2>
          </div>
          <div className="space-y-3">
            {data.doctorOps.length === 0 && <p className="text-sm text-text-muted">No active doctors.</p>}
            {data.doctorOps.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                    {(doc.name as string)?.charAt(0)}
                  </div>
                  <span className="font-medium text-sm text-text">{doc.name as string}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGES[doc.statusColor as string]?.bg || "bg-gray-100 text-gray-800"}`}>
                  {doc.statusLabel as string}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-text">Doctor Leaderboard</h2>
            <span className="text-xs text-text-muted ml-auto">This Month</span>
          </div>
          <div className="space-y-3">
            {data.doctorLeaderboard.length === 0 && <p className="text-sm text-text-muted">No data yet.</p>}
            {data.doctorLeaderboard.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                    {i + 1}
                  </span>
                  <span className="font-medium text-sm text-text">{doc.name as string}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-text">{doc.consultations as number} visits</div>
                  <div className="text-xs text-text-muted">{(doc.treatmentPlans as number) || 0} plans</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Therapist Ops + Leaderboard */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-text">Live Therapist Operations</h2>
          </div>
          <div className="space-y-3">
            {data.therapistOps.length === 0 && <p className="text-sm text-text-muted">No active therapists.</p>}
            {data.therapistOps.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                    {(t.name as string)?.charAt(0)}
                  </div>
                  <span className="font-medium text-sm text-text">{t.name as string}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGES[t.statusColor as string]?.bg || "bg-gray-100 text-gray-800"}`}>
                  {t.statusLabel as string}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-green-500" />
            <h2 className="font-semibold text-text">Therapist Leaderboard</h2>
            <span className="text-xs text-text-muted ml-auto">This Month</span>
          </div>
          <div className="space-y-3">
            {data.therapistLeaderboard.length === 0 && <p className="text-sm text-text-muted">No data yet.</p>}
            {data.therapistLeaderboard.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {i + 1}
                  </span>
                  <span className="font-medium text-sm text-text">{t.name as string}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-700">{t.completed as number} done</div>
                  <div className="text-xs text-text-muted">{(t.pending as number) || 0} pending</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Staff Attendance */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-text">Staff Attendance Today</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {data.staffAttendance.map((staff, i) => {
            const roleColor = ROLE_COLORS[(staff.role as string) || "admin"];
            return (
              <div key={i} className="p-3 rounded-lg bg-surface border border-border text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: roleColor }}>
                  {(staff.name as string)?.charAt(0)}
                </div>
                <div className="text-xs font-medium text-text truncate">{staff.name as string}</div>
                <div className="text-[10px] px-1.5 py-0.5 rounded-full mt-1 inline-block font-medium" style={{ backgroundColor: `${roleColor}20`, color: roleColor }}>
                  {staff.role as string}
                </div>
                <div className="mt-2 text-[10px] text-text-muted">
                  {staff.loggedInAt ? new Date(staff.loggedInAt as string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                  {" → "}
                  {staff.loggedOutAt ? new Date(staff.loggedOutAt as string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : (staff.isCurrentlyLoggedIn ? "Active" : "—")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 5: Activity Feed */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-text">Live Activity Feed</h2>
          <span className="text-xs text-text-muted ml-auto">Auto-refreshes every 30s</span>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {data.activityFeed.length === 0 && <p className="text-sm text-text-muted py-4 text-center">No recent activity.</p>}
          {data.activityFeed.map((activity, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface transition-colors">
              <span className="text-lg mt-0.5">{ACTIVITY_ICONS[(activity.userRole as string)] || "⚪"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text">
                  <span className="font-medium">[{activity.userName as string}]</span>{" "}
                  {activity.action as string}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {new Date(activity.timestamp as string).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 6: Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-text">Top Products Sold</h2>
            <span className="text-xs text-text-muted ml-auto">This Month</span>
          </div>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-10">No pharmacy sales yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.topProducts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {data.topProducts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-text">Top Treatments by Doctors</h2>
            <span className="text-xs text-text-muted ml-auto">This Month</span>
          </div>
          {data.topTreatments.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-10">No treatment plans yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.topTreatments} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {data.topTreatments.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <h2 className="font-semibold text-text mb-4">Revenue vs Expenses (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D4C9B0" />
            <XAxis dataKey="name" stroke="#6B6560" />
            <YAxis stroke="#6B6560" />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#4A6741" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#C0392B" name="Expenses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
