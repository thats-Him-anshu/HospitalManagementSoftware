"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/Card";
import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/shared/Button";
import * as XLSX from "xlsx";
import { format } from "date-fns";

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      // In a real scenario, the API endpoints would accept month and year to filter.
      // Currently, /api/invoices fetches all, and we'll filter on the client for simplicity.
      // /api/expenses supports month/year.
      
      const [invRes, expRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch(`/api/expenses?month=${selectedMonth}&year=${selectedYear}`)
      ]);
      
      const invData = await invRes.json();
      const expData = await expRes.json();
      
      if (invData.success) {
        // Filter invoices by selected month/year
        const filteredInvoices = invData.data.filter((inv: any) => {
          const d = new Date(inv.createdAt);
          return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
        });
        setInvoices(filteredInvoices);
      }
      
      if (expData.success) {
        setExpenses(expData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [selectedMonth, selectedYear]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);
  };

  // Calculations
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const amountCollected = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const outstandingPayments = invoices.reduce((acc, inv) => acc + inv.balance, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = amountCollected - totalExpenses;

  // Exports
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      { Metric: "Total Revenue Generated", Amount: totalRevenue },
      { Metric: "Actual Amount Collected", Amount: amountCollected },
      { Metric: "Outstanding Payments", Amount: outstandingPayments },
      { Metric: "Total Expenses", Amount: totalExpenses },
      { Metric: "Net Profit (Cash Flow)", Amount: netProfit },
    ];
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    // Invoices Sheet
    const invData = invoices.map(i => ({
      "Invoice No": i.invoiceNumber,
      "Date": format(new Date(i.createdAt), "dd MMM yyyy"),
      "Patient": `${i.patient?.firstName} ${i.patient?.lastName}`,
      "Total Amount": i.totalAmount,
      "Amount Paid": i.amountPaid,
      "Balance": i.balance,
      "Status": i.paymentStatus
    }));
    const invWs = XLSX.utils.json_to_sheet(invData);
    XLSX.utils.book_append_sheet(wb, invWs, "Invoices");

    // Expenses Sheet
    const expData = expenses.map(e => ({
      "Date": format(new Date(e.date), "dd MMM yyyy"),
      "Category": e.category,
      "Vendor": e.vendor?.name || "-",
      "Amount": e.amount,
      "Payment Method": e.paymentMethod
    }));
    const expWs = XLSX.utils.json_to_sheet(expData);
    XLSX.utils.book_append_sheet(wb, expWs, "Expenses");

    XLSX.writeFile(wb, `Financial_Report_${selectedMonth}_${selectedYear}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Financial Reports</h2>
          <p className="text-sm text-text-muted mt-1">Consolidated P&L and financial health</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:ring-primary outline-none"
            >
              {Array.from({length: 12}).map((_, i) => (
                <option key={i+1} value={i+1}>{format(new Date(2000, i, 1), "MMMM")}</option>
              ))}
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:ring-primary outline-none"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" onClick={exportToExcel} disabled={loading}>
            <Download className="mr-2 h-4 w-4" /> Export Excel
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center text-text-muted">Loading financial data...</Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-medium text-text-muted">Total Revenue</h3>
                </div>
                <div className="text-2xl font-bold text-text">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-text-muted mt-1">Billed amount for the month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-success/10 rounded-lg text-success">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-medium text-text-muted">Collected</h3>
                </div>
                <div className="text-2xl font-bold text-text">{formatCurrency(amountCollected)}</div>
                <p className="text-xs text-text-muted mt-1">Actual cash flow received</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-warning/10 rounded-lg text-warning-dark">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-medium text-text-muted">Outstanding</h3>
                </div>
                <div className="text-2xl font-bold text-text">{formatCurrency(outstandingPayments)}</div>
                <p className="text-xs text-text-muted mt-1">Pending from patients</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-danger/10 rounded-lg text-danger">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-medium text-text-muted">Expenses</h3>
                </div>
                <div className="text-2xl font-bold text-text">{formatCurrency(totalExpenses)}</div>
                <p className="text-xs text-text-muted mt-1">Total operational costs</p>
              </CardContent>
            </Card>
          </div>

          <Card className={`p-6 border-2 ${netProfit >= 0 ? 'border-success/50' : 'border-danger/50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Net Profit (Cash Flow)</h3>
                <p className="text-sm text-text-muted">Collected Amount - Total Expenses</p>
              </div>
              <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(netProfit)}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.slice(0, 5).map(inv => (
                    <div key={inv._id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-text">{inv.invoiceNumber}</p>
                        <p className="text-xs text-text-muted">{inv.patient?.firstName} {inv.patient?.lastName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(inv.totalAmount)}</p>
                        <p className="text-xs text-text-muted capitalize">{inv.paymentStatus}</p>
                      </div>
                    </div>
                  ))}
                  {invoices.length === 0 && <p className="text-sm text-text-muted text-center py-4">No invoices this month.</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.slice(0, 5).map(exp => (
                    <div key={exp._id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-text">{exp.category}</p>
                        <p className="text-xs text-text-muted">{format(new Date(exp.date), "dd MMM yyyy")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-danger">-{formatCurrency(exp.amount)}</p>
                      </div>
                    </div>
                  ))}
                  {expenses.length === 0 && <p className="text-sm text-text-muted text-center py-4">No expenses this month.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
