"use client";

import { useEffect, useState } from "react";
import { Plus, Download, Mail, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { format } from "date-fns";
import Link from "next/link";
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from "@/components/pdf/InvoicePDF";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadPDF = async (invoice: any) => {
    setProcessingId(invoice._id);
    try {
      // In a real app, you might want to fetch full patient data if not fully populated
      const blob = await pdf(<InvoicePDF invoice={invoice} patient={invoice.patient} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoice.invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("Failed to generate PDF");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendEmail = async (invoice: any) => {
    if (!invoice.patient?.email) {
      alert("Patient does not have an email address recorded.");
      return;
    }
    
    if (!confirm(`Send invoice to ${invoice.patient.email}?`)) return;

    setProcessingId(invoice._id + "_email");
    try {
      // 1. Generate PDF base64
      const blob = await pdf(<InvoicePDF invoice={invoice} patient={invoice.patient} />).toBlob();
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = async () => {
        const base64data = reader.result;

        // 2. Send via API
        const res = await fetch(`/api/invoices/${invoice._id}/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            pdfBase64: base64data,
            emailTo: invoice.patient.email 
          })
        });

        const data = await res.json();
        if (data.success) {
          alert("Email sent successfully!");
          fetchInvoices(); // Refresh to show emailSent status
        } else {
          alert(data.error || "Failed to send email");
        }
        setProcessingId(null);
      };
    } catch (error) {
      console.error("Error sending email", error);
      alert("Failed to send email");
      setProcessingId(null);
    }
  };

  const handleSendWhatsApp = async (invoice: any) => {
    const phone = invoice.patient?.phone;
    if (!phone) { alert("Patient does not have a phone number recorded."); return; }
    if (!confirm(`Send invoice via WhatsApp to ${phone}?`)) return;
    setProcessingId(invoice._id + "_wa");
    try {
      const res = await fetch(`/api/invoices/${invoice._id}/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) { alert("WhatsApp message sent!"); fetchInvoices(); }
      else alert(data.error || "Failed to send WhatsApp message");
    } catch (e) { console.error(e); alert("Failed to send WhatsApp message"); }
    finally { setProcessingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Billing & Invoices</h2>
          <p className="text-sm text-text-muted mt-1">Manage patient invoices and payments</p>
        </div>
        <Link href="/admin/billing/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Invoice No & Date</th>
                <th className="px-6 py-4 font-medium text-text-muted">Patient</th>
                <th className="px-6 py-4 font-medium text-text-muted">Amount</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                <th className="px-6 py-4 font-medium text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-text-muted">Loading invoices...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-text-muted">No invoices found.</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{inv.invoiceNumber}</div>
                      <div className="text-xs text-text-muted mt-0.5">{format(new Date(inv.createdAt), "dd MMM yyyy")}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary">{inv.patient?.firstName} {inv.patient?.lastName}</div>
                      <div className="text-xs text-text-muted mt-0.5">{inv.patient?.patientId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{formatCurrency(inv.totalAmount)}</div>
                      {inv.balance > 0 && (
                        <div className="text-xs text-danger mt-0.5">Due: {formatCurrency(inv.balance)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                          ${inv.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 
                            inv.paymentStatus === 'partial' ? 'bg-warning/10 text-warning-dark' : 
                            'bg-danger/10 text-danger'}
                        `}>
                          {inv.paymentStatus}
                        </span>
                        <div className="flex gap-1">
                          {inv.emailSent && <span className="text-[10px] bg-surface text-text-muted px-1.5 py-0.5 rounded border border-border">Email Sent</span>}
                          {inv.whatsappSent && <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200">WA Sent</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDownloadPDF(inv)}
                          disabled={processingId === inv._id}
                          className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-surface disabled:opacity-50"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleSendEmail(inv)}
                          disabled={processingId === inv._id + "_email"}
                          className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-surface disabled:opacity-50"
                          title="Send via Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleSendWhatsApp(inv)}
                          disabled={processingId === inv._id + "_wa"}
                          className="p-1.5 text-text-muted hover:text-green-600 transition-colors rounded-md hover:bg-green-50 disabled:opacity-50"
                          title="Send via WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
