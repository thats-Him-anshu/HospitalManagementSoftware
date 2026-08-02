"use client";

import { useState, useEffect, useCallback } from "react";
import { Activity, RefreshCw, Users, UserCheck } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  doctor: "#3B82F6", receptionist: "#14B8A6", therapist: "#22C55E",
  telecaller: "#A855F7", pharmacy: "#F97316", admin: "#6B7280",
};
const STATUS_BADGES: Record<string, string> = {
  green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800", orange: "bg-orange-100 text-orange-800",
};

export default function LiveOperationsReport() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 30000); return () => clearInterval(i); }, [fetchData]);

  if (loading) return <div className="flex items-center justify-center h-96"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data) return <div className="text-center py-20 text-text-muted">Failed to load.</div>;

  const doctorOps = (data.doctorOps as Array<Record<string, unknown>>) || [];
  const therapistOps = (data.therapistOps as Array<Record<string, unknown>>) || [];
  const staffAttendance = (data.staffAttendance as Array<Record<string, unknown>>) || [];
  const activityFeed = (data.activityFeed as Array<Record<string, unknown>>) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-text">Live Operations</h1>
        <button onClick={fetchData} className="flex items-center gap-2 text-sm text-text-muted hover:text-primary"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <h2 className="font-semibold text-text mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> Doctor Operations</h2>
          <div className="space-y-3">
            {doctorOps.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">{(doc.name as string)?.charAt(0)}</div>
                  <span className="font-medium text-sm">{doc.name as string}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGES[doc.statusColor as string] || "bg-gray-100 text-gray-800"}`}>{doc.statusLabel as string}</span>
              </div>
            ))}
            {doctorOps.length === 0 && <p className="text-sm text-text-muted">No active doctors.</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <h2 className="font-semibold text-text mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-green-600" /> Therapist Operations</h2>
          <div className="space-y-3">
            {therapistOps.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">{(t.name as string)?.charAt(0)}</div>
                  <span className="font-medium text-sm">{t.name as string}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGES[t.statusColor as string] || "bg-gray-100 text-gray-800"}`}>{t.statusLabel as string}</span>
              </div>
            ))}
            {therapistOps.length === 0 && <p className="text-sm text-text-muted">No active therapists.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <h2 className="font-semibold text-text mb-4 flex items-center gap-2"><UserCheck className="w-5 h-5 text-primary" /> Staff Attendance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {staffAttendance.map((s, i) => (
            <div key={i} className="p-3 rounded-lg bg-surface border border-border text-center">
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: ROLE_COLORS[(s.role as string)] || "#6B7280" }}>{(s.name as string)?.charAt(0)}</div>
              <div className="text-xs font-medium truncate">{s.name as string}</div>
              <div className="text-[10px] mt-1" style={{ color: ROLE_COLORS[(s.role as string)] }}>{s.role as string}</div>
              <div className="text-[10px] text-text-muted mt-1">{s.loggedInAt ? new Date(s.loggedInAt as string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"} → {s.loggedOutAt ? new Date(s.loggedOutAt as string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : s.isCurrentlyLoggedIn ? "Active" : "—"}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <h2 className="font-semibold text-text mb-4">Activity Feed</h2>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {activityFeed.length === 0 && <p className="text-sm text-text-muted text-center py-4">No recent activity.</p>}
          {activityFeed.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5" style={{ backgroundColor: ROLE_COLORS[(a.userRole as string)] || "#6B7280" }}>{(a.userName as string)?.charAt(0)}</div>
              <div><p className="text-sm"><span className="font-medium">{a.userName as string}</span> {a.action as string}</p><p className="text-xs text-text-muted">{new Date(a.timestamp as string).toLocaleString()}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
