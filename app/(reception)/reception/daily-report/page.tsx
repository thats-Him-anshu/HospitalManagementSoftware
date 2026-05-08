"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";

export default function DailyReportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [aptRes, invRes, patRes, leadRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/invoices"),
          fetch("/api/patients"),
          fetch("/api/leads"),
        ]);
        const [aptData, invData, patData, leadData] = await Promise.all([
          aptRes.json(), invRes.json(), patRes.json(), leadRes.json(),
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAppts = (aptData.data || []).filter((a: any) => new Date(a.appointmentDate) >= today && new Date(a.appointmentDate) < tomorrow);
        const todayInvoices = (invData.data || []).filter((i: any) => new Date(i.createdAt) >= today && new Date(i.createdAt) < tomorrow);
        const todayPatients = (patData.data || []).filter((p: any) => new Date(p.createdAt) >= today && new Date(p.createdAt) < tomorrow);
        const todayLeads = (leadData.data || []).filter((l: any) => new Date(l.createdAt) >= today && new Date(l.createdAt) < tomorrow);

        const todayRevenue = todayInvoices.reduce((a: number, i: any) => a + (i.amountPaid || 0), 0);
        const todayBilled = todayInvoices.reduce((a: number, i: any) => a + (i.totalAmount || 0), 0);

        setData({
          date: today,
          appointments: todayAppts.length,
          completed: todayAppts.filter((a: any) => a.status === "completed").length,
          newPatients: todayPatients.length,
          newLeads: todayLeads.length,
          invoicesCreated: todayInvoices.length,
          totalBilled: todayBilled,
          totalCollected: todayRevenue,
          todayAppts,
          todayInvoices,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchAll();
  }, []);

  const formatCurrency = (a: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(a);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Daily Report</h2>
          <p className="text-sm text-text-muted mt-1">{format(data?.date || new Date(), "EEEE, dd MMMM yyyy")}</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}><Download className="mr-2 h-4 w-4" /> Print / Save PDF</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-text">{data?.appointments || 0}</p><p className="text-xs text-text-muted mt-1">Total Appointments</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{data?.completed || 0}</p><p className="text-xs text-text-muted mt-1">Completed</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-text">{data?.newPatients || 0}</p><p className="text-xs text-text-muted mt-1">New Patients</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-text">{data?.newLeads || 0}</p><p className="text-xs text-text-muted mt-1">New Leads</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-text-muted">Invoices Created</p><p className="text-xl font-bold mt-1">{data?.invoicesCreated || 0}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-text-muted">Total Billed</p><p className="text-xl font-bold mt-1 text-primary">{formatCurrency(data?.totalBilled || 0)}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-text-muted">Total Collected</p><p className="text-xl font-bold mt-1 text-green-600">{formatCurrency(data?.totalCollected || 0)}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Today&apos;s Appointments Summary</CardTitle></CardHeader>
        <CardContent>
          {(data?.todayAppts || []).length === 0 ? <p className="text-sm text-text-muted text-center py-4">No appointments today.</p> : (
            <div className="space-y-2">
              {data.todayAppts.map((a: any) => (
                <div key={a._id} className="flex justify-between items-center p-2 bg-surface rounded-md text-sm">
                  <span className="font-medium">{a.patient?.firstName} {a.patient?.lastName}</span>
                  <span className="text-text-muted">{a.timeSlot} • <span className="capitalize">{a.status}</span></span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
