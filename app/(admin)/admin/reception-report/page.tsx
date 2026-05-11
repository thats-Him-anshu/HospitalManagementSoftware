"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Download, Calendar, IndianRupee, Users, Clock } from "lucide-react";
import { format } from "date-fns";

export default function ReceptionReportPage() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const startOfDay = `${date}T00:00:00.000Z`;
      const endOfDay = `${date}T23:59:59.999Z`;
      const [aptRes, invRes, logsRes] = await Promise.all([
        fetch(`/api/appointments?start=${startOfDay}&end=${endOfDay}`),
        fetch("/api/invoices"),
        fetch(`/api/check-in?start=${startOfDay}&end=${endOfDay}`),
      ]);
      const aptData = await aptRes.json();
      const invData = await invRes.json();
      const logsData = await logsRes.json();

      const selDate = new Date(date);
      selDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(selDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayInvoices = (invData.data || []).filter((i: any) => {
        const d = new Date(i.createdAt);
        return d >= selDate && d < nextDate;
      });

      const totalBilled = dayInvoices.reduce((a: number, i: any) => a + (i.totalAmount || 0), 0);
      const totalCollected = dayInvoices.reduce((a: number, i: any) => a + (i.amountPaid || 0), 0);
      const totalPending = totalBilled - totalCollected;

      setData({
        appointments: aptData.data || [],
        invoices: dayInvoices,
        logs: logsData.data || [],
        totalBilled,
        totalCollected,
        totalPending,
        totalOPD: (aptData.data || []).length,
        completed: (aptData.data || []).filter((a: any) => a.status === "completed").length,
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [date]);

  const formatCurrency = (a: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(a);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-text">Reception / Daily Report</h2>
        <div className="flex items-center gap-3">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10 rounded-md border border-border px-3 text-sm" />
          <Button variant="outline" onClick={() => window.print()}><Download className="mr-2 h-4 w-4" />Export PDF</Button>
        </div>
      </div>

      {loading ? <p className="text-center py-12 text-text-muted">Loading...</p> : data && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print:grid-cols-5">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-text">{data.totalOPD}</p><p className="text-xs text-text-muted mt-1">Total OPD</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{data.completed}</p><p className="text-xs text-text-muted mt-1">Completed</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{formatCurrency(data.totalBilled)}</p><p className="text-xs text-text-muted mt-1">Total Billed</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{formatCurrency(data.totalCollected)}</p><p className="text-xs text-text-muted mt-1">Collected</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-orange-600">{formatCurrency(data.totalPending)}</p><p className="text-xs text-text-muted mt-1">Pending</p></CardContent></Card>
          </div>

          {/* OPD Register */}
          <Card>
            <CardHeader><CardTitle>OPD Register — {format(new Date(date), "dd MMMM yyyy")}</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium text-text-muted">#</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Patient</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Doctor</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Time</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Type</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.appointments.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-text-muted">No appointments for this date.</td></tr> :
                    data.appointments.map((a: any, i: number) => (
                      <tr key={a._id} className="hover:bg-surface/50">
                        <td className="px-4 py-3 text-text-muted">{i + 1}</td>
                        <td className="px-4 py-3 font-medium">{a.patient?.firstName} {a.patient?.lastName} <span className="text-xs text-text-muted">({a.patient?.patientId})</span></td>
                        <td className="px-4 py-3 text-text-muted">{a.doctor?.name || "—"}</td>
                        <td className="px-4 py-3 text-text-muted">{a.timeSlot}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">{a.type}</span></td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${a.status === "completed" ? "bg-green-100 text-green-700" : a.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Collection summary */}
          <Card>
            <CardHeader><CardTitle>Collection Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium text-text-muted">Invoice #</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Patient</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Total</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Paid</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Balance</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Method</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.invoices.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-text-muted">No invoices for this date.</td></tr> :
                    data.invoices.map((inv: any) => (
                      <tr key={inv._id} className="hover:bg-surface/50">
                        <td className="px-4 py-3 font-mono text-sm">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 font-medium">{inv.patient?.firstName} {inv.patient?.lastName}</td>
                        <td className="px-4 py-3">{formatCurrency(inv.totalAmount)}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">{formatCurrency(inv.amountPaid)}</td>
                        <td className="px-4 py-3 text-orange-600">{formatCurrency(inv.balance)}</td>
                        <td className="px-4 py-3 uppercase text-xs">{inv.paymentMethod}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${inv.paymentStatus === "paid" ? "bg-green-100 text-green-700" : inv.paymentStatus === "partial" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{inv.paymentStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Check-In/Out log */}
          <Card>
            <CardHeader><CardTitle>Check-In / Check-Out Log</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium text-text-muted">Time</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Patient</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Patient ID</th>
                      <th className="px-4 py-3 font-medium text-text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.logs.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-text-muted">No check-in/out activity recorded.</td></tr> :
                    data.logs.map((log: any) => (
                      <tr key={log._id} className="hover:bg-surface/50">
                        <td className="px-4 py-3 font-mono">{format(new Date(log.timestamp), "hh:mm a")}</td>
                        <td className="px-4 py-3 font-medium">{log.patient?.firstName} {log.patient?.lastName}</td>
                        <td className="px-4 py-3 text-text-muted">{log.patient?.patientId}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${log.action === "check-in" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{log.action}</span></td>
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
