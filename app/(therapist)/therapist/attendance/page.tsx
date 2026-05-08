"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { LogIn, LogOut } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

export default function TherapistAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?scope=mine&month=${now.getMonth() + 1}&year=${now.getFullYear()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const found = data.data.find((r: any) => isSameDay(new Date(r.date), today));
        setTodayRecord(found || null);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAttendance(); }, []);

  const handleCheckIn = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString().split("T")[0], status: "present", checkIn: new Date().toISOString() }),
      });
      if (res.ok) fetchAttendance();
    } catch (e) { console.error(e); }
    finally { setProcessing(false); }
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString().split("T")[0], checkOut: new Date().toISOString() }),
      });
      if (res.ok) fetchAttendance();
    } catch (e) { console.error(e); }
    finally { setProcessing(false); }
  };

  const getStatusForDay = (day: Date) => {
    const r = records.find((r: any) => isSameDay(new Date(r.date), day));
    return r?.status;
  };

  const statusColor: Record<string, string> = {
    present: "bg-green-500 text-white",
    absent: "bg-red-500 text-white",
    leave: "bg-yellow-500 text-white",
    "half-day": "bg-orange-400 text-white",
  };

  const presentCount = records.filter(r => r.status === "present").length;
  const absentCount = records.filter(r => r.status === "absent").length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">My Attendance</h2>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Today — {format(now, "EEEE, dd MMMM yyyy")}</h3>
              {todayRecord ? (
                <div className="text-sm mt-2 space-y-1">
                  <p className="text-text-muted">Check-in: <span className="font-medium text-green-600">{todayRecord.checkIn ? format(new Date(todayRecord.checkIn), "hh:mm a") : "—"}</span></p>
                  <p className="text-text-muted">Check-out: <span className="font-medium text-orange-600">{todayRecord.checkOut ? format(new Date(todayRecord.checkOut), "hh:mm a") : "Not yet"}</span></p>
                </div>
              ) : (
                <p className="text-sm text-text-muted mt-1">Not checked in yet</p>
              )}
            </div>
            <div className="flex gap-3">
              {!todayRecord && (
                <Button onClick={handleCheckIn} isLoading={processing} className="bg-green-600 hover:bg-green-700"><LogIn className="mr-2 h-4 w-4" /> Check In</Button>
              )}
              {todayRecord && !todayRecord.checkOut && (
                <Button onClick={handleCheckOut} isLoading={processing} variant="outline"><LogOut className="mr-2 h-4 w-4" /> Check Out</Button>
              )}
              {todayRecord && todayRecord.checkOut && (
                <span className="text-sm text-green-600 font-medium px-4 py-2 bg-green-50 rounded-md">✓ Day Complete</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{format(now, "MMMM yyyy")} Calendar</CardTitle>
            <div className="flex gap-4 text-xs">
              <span className="text-green-600 font-medium">Present: {presentCount}</span>
              <span className="text-red-600 font-medium">Absent: {absentCount}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="py-2 font-semibold text-text-muted">{d}</div>
            ))}
            {/* Pad start */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => <div key={`pad-${i}`} />)}
            {days.map(day => {
              const status = getStatusForDay(day);
              const isToday = isSameDay(day, now);
              return (
                <div key={day.toISOString()} className={`py-2 rounded-md text-xs font-medium ${status ? statusColor[status] : "text-text-muted"} ${isToday ? "ring-2 ring-blue-400" : ""}`}>
                  {format(day, "d")}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
