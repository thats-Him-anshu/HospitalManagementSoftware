"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Download, BedDouble, Users, Clock, Activity } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function IPOPReportPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(format(new Date(new Date().setDate(1)), "yyyy-MM-dd"));
  const [dateTo, setDateTo] = useState(format(new Date(), "yyyy-MM-dd"));

  const fetchData = async () => {
    setLoading(true);
    try {
      const [admRes, roomRes] = await Promise.all([
        fetch("/api/admissions"),
        fetch("/api/rooms"),
      ]);
      const admData = await admRes.json();
      const roomData = await roomRes.json();
      if (admData.success) setAdmissions(admData.data);
      if (roomData.success) setRooms(roomData.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const activeIP = admissions.filter(a => a.admissionType === "IP" && a.status === "active");
  const activeOP = admissions.filter(a => a.admissionType === "OP" && a.status === "active");

  const fromDate = new Date(dateFrom); fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(dateTo); toDate.setHours(23, 59, 59, 999);
  const rangeAdmissions = admissions.filter(a => {
    const d = new Date(a.admissionDate);
    return d >= fromDate && d <= toDate;
  });

  const totalBeds = rooms.reduce((a: number, r: any) => a + (r.beds || []).length, 0);
  const occupiedBeds = rooms.reduce((a: number, r: any) => a + (r.beds || []).filter((b: any) => b.isOccupied).length, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const dischargedIP = admissions.filter(a => a.admissionType === "IP" && a.status === "discharged" && a.dischargeDate);
  const avgStay = dischargedIP.length > 0
    ? Math.round(dischargedIP.reduce((sum: number, a: any) => sum + differenceInDays(new Date(a.dischargeDate), new Date(a.admissionDate)), 0) / dischargedIP.length)
    : 0;



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-text">IP/OP Report</h2>
        <Button variant="outline" onClick={() => window.print()}><Download className="mr-2 h-4 w-4" />Export PDF</Button>
      </div>

      {loading ? <p className="text-center py-12 text-text-muted">Loading...</p> : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-full bg-purple-100"><BedDouble className="h-5 w-5 text-purple-600" /></div><div><p className="text-xs text-text-muted">Active IP</p><p className="text-2xl font-bold">{activeIP.length}</p></div></CardContent></Card>
            <Card><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-full bg-teal-100"><Users className="h-5 w-5 text-teal-600" /></div><div><p className="text-xs text-text-muted">Active OP</p><p className="text-2xl font-bold">{activeOP.length}</p></div></CardContent></Card>
            <Card><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-full bg-blue-100"><Activity className="h-5 w-5 text-blue-600" /></div><div><p className="text-xs text-text-muted">Bed Occupancy</p><p className="text-2xl font-bold">{occupancyRate}%</p><p className="text-[10px] text-text-muted">{occupiedBeds}/{totalBeds} beds</p></div></CardContent></Card>
            <Card><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-full bg-orange-100"><Clock className="h-5 w-5 text-orange-600" /></div><div><p className="text-xs text-text-muted">Avg Stay (IP)</p><p className="text-2xl font-bold">{avgStay} days</p></div></CardContent></Card>
          </div>

          {/* Active IP Admissions */}
          <Card>
            <CardHeader><CardTitle>Current Active IP Admissions ({activeIP.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium text-text-muted">Patient</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Admitted</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Days</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Room/Bed</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Doctor</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Diagnosis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activeIP.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-text-muted">No active IP admissions.</td></tr> :
                    activeIP.map(a => (
                      <tr key={a._id} className="hover:bg-surface/50">
                        <td className="px-4 py-3 font-medium">{a.patient?.firstName} {a.patient?.lastName}</td>
                        <td className="px-4 py-3 text-text-muted">{format(new Date(a.admissionDate), "dd MMM yyyy")}</td>
                        <td className="px-4 py-3 font-medium">{differenceInDays(new Date(), new Date(a.admissionDate))}</td>
                        <td className="px-4 py-3 text-text-muted">{a.room?.roomNumber || "—"} / {a.bed || "—"}</td>
                        <td className="px-4 py-3 text-text-muted">{a.admittingDoctor?.name || "—"}</td>
                        <td className="px-4 py-3 text-text-muted text-xs">{a.diagnosisOnAdmission || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Room Occupancy */}
          <Card>
            <CardHeader><CardTitle>Room Occupancy Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {rooms.map((room: any) => {
                  const beds = room.beds || [];
                  const occ = beds.filter((b: any) => b.isOccupied).length;
                  return (
                    <div key={room._id} className={`p-3 rounded-lg border ${occ === beds.length && beds.length > 0 ? "border-danger/50 bg-danger/5" : "border-success/50 bg-success/5"}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">Room {room.roomNumber}</span>
                        <span className="text-xs capitalize text-text-muted">{room.type || room.roomType}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {beds.map((b: any, i: number) => (
                          <div key={i} className={`w-6 h-6 rounded text-[10px] flex items-center justify-center font-medium ${b.isOccupied ? "bg-danger/20 text-danger" : "bg-success/20 text-success"}`}>{b.bedNumber?.slice(-1) || i + 1}</div>
                        ))}
                      </div>
                      <p className="text-[10px] text-text-muted mt-1">{occ}/{beds.length} occupied</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Date range admissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Admissions Report</CardTitle>
                <div className="flex gap-2 items-center">
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 rounded-md border border-border px-2 text-xs" />
                  <span className="text-text-muted text-xs">to</span>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 rounded-md border border-border px-2 text-xs" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium text-text-muted">Patient</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Type</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Admitted</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Discharged</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Doctor</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rangeAdmissions.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-text-muted">No admissions in this range.</td></tr> :
                    rangeAdmissions.map(a => (
                      <tr key={a._id} className="hover:bg-surface/50">
                        <td className="px-4 py-3 font-medium">{a.patient?.firstName} {a.patient?.lastName}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${a.admissionType === "IP" ? "bg-purple-100 text-purple-700" : "bg-teal-100 text-teal-700"}`}>{a.admissionType}</span></td>
                        <td className="px-4 py-3 text-text-muted">{format(new Date(a.admissionDate), "dd MMM yyyy")}</td>
                        <td className="px-4 py-3 text-text-muted">{a.dischargeDate ? format(new Date(a.dischargeDate), "dd MMM yyyy") : "—"}</td>
                        <td className="px-4 py-3 text-text-muted">{a.admittingDoctor?.name || "—"}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${a.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
