"use client";

import { useEffect, useState } from "react";
import { Plus, Download, Mail } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { format } from "date-fns";
import Link from "next/link";

export default function ReceptionBillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function f() {
      try {
        const res = await fetch("/api/invoices");
        const data = await res.json();
        if (data.success) setInvoices(data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    f();
  }, []);

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold text-text">Billing & Invoices</h2>
        <Link href="/reception/billing/new"><Button><Plus className="mr-2 h-4 w-4" /> Create Invoice</Button></Link>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Invoice</th>
                <th className="px-6 py-4 font-medium text-text-muted">Patient</th>
                <th className="px-6 py-4 font-medium text-text-muted">Amount</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? <tr><td colSpan={4} className="text-center py-12 text-text-muted">Loading...</td></tr> :
              invoices.length === 0 ? <tr><td colSpan={4} className="text-center py-12 text-text-muted">No invoices.</td></tr> :
              invoices.map(inv => (
                <tr key={inv._id} className="hover:bg-surface/50">
                  <td className="px-6 py-4"><div className="font-medium">{inv.invoiceNumber}</div><div className="text-xs text-text-muted">{format(new Date(inv.createdAt), "dd MMM yyyy")}</div></td>
                  <td className="px-6 py-4 font-medium text-primary">{inv.patient?.firstName} {inv.patient?.lastName}</td>
                  <td className="px-6 py-4"><div className="font-medium">{formatCurrency(inv.totalAmount)}</div>{inv.balance > 0 && <div className="text-xs text-danger">Due: {formatCurrency(inv.balance)}</div>}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs capitalize font-medium ${inv.paymentStatus === "paid" ? "bg-green-100 text-green-700" : inv.paymentStatus === "partial" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{inv.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
