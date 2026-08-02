"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Pill,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PIE_COLORS = ["#4A6741", "#8B7355", "#C8A96E", "#5A8A4A", "#D4882A"];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function FinancialSummaryPage() {
  const [loading, setLoading] = useState(true);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [monthExpenses, setMonthExpenses] = useState(0);
  const [pharmacyRevenue, setPharmacyRevenue] = useState(0);
  const [paymentMethodData, setPaymentMethodData] = useState<
    { name: string; value: number }[]
  >([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, invRes, expRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/invoices"),
        fetch("/api/expenses"),
      ]);

      const dashData = await dashRes.json();
      const invData = await invRes.json();
      const expData = await expRes.json();

      if (dashData.success) {
        setTodayRevenue(dashData.data.todayRevenue || 0);
        setMonthRevenue(dashData.data.monthRevenue || 0);
      }

      if (invData.success && Array.isArray(invData.data)) {
        const invoices = invData.data;

        // Outstanding balance = sum of balance where paymentStatus != paid
        const outstanding = invoices.reduce(
          (acc: number, inv: any) =>
            inv.paymentStatus !== "paid" ? acc + (inv.balance || 0) : acc,
          0
        );
        setOutstandingBalance(outstanding);

        // Payment method breakdown from all invoices
        const methodMap: Record<string, number> = {};
        invoices.forEach((inv: any) => {
          const method = inv.paymentMethod || "Other";
          methodMap[method] = (methodMap[method] || 0) + (inv.amountPaid || 0);
        });
        const methodData = Object.entries(methodMap)
          .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))
          .filter((d) => d.value > 0)
          .sort((a, b) => b.value - a.value);
        setPaymentMethodData(methodData);
      }

      if (expData.success && Array.isArray(expData.data)) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthExp = expData.data
          .filter((e: any) => new Date(e.date) >= startOfMonth)
          .reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
        setMonthExpenses(monthExp);
      }

      // Pharmacy revenue — try fetching from pharmacy-sales
      try {
        const pharmRes = await fetch("/api/pharmacy-sales");
        const pharmData = await pharmRes.json();
        if (pharmData.success && Array.isArray(pharmData.data)) {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const pharmTotal = pharmData.data
            .filter((s: any) => new Date(s.createdAt) >= startOfMonth)
            .reduce((acc: number, s: any) => acc + (s.totalAmount || 0), 0);
          setPharmacyRevenue(pharmTotal);
        }
      } catch {
        setPharmacyRevenue(0);
      }
    } catch (err) {
      console.error("Error fetching financial data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const netProfit = monthRevenue + pharmacyRevenue - monthExpenses;

  const statCards = [
    {
      label: "Today's Collection",
      value: formatCurrency(todayRevenue),
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "This Month's Revenue",
      value: formatCurrency(monthRevenue),
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Outstanding Balance",
      value: formatCurrency(outstandingBalance),
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "This Month's Expenses",
      value: formatCurrency(monthExpenses),
      icon: TrendingDown,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Net Profit",
      value: formatCurrency(netProfit),
      icon: CreditCard,
      color: netProfit >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
    },
    {
      label: "Pharmacy Revenue",
      value: formatCurrency(pharmacyRevenue),
      icon: Pill,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-text">
            Financial Summary
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Live financial snapshot of hospital operations
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-border p-5 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-sm text-text-muted">{card.label}</span>
            </div>
            <div className="text-2xl font-bold text-text">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Payment Method Pie Chart */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <h2 className="font-semibold text-text mb-4 font-display">
          Payment Method Breakdown
        </h2>
        {paymentMethodData.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {paymentMethodData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-3">
              {paymentMethodData.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          PIE_COLORS[index % PIE_COLORS.length],
                      }}
                    />
                    <span className="text-sm font-medium text-text">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-text">
                    {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center py-12 text-text-muted">
            No payment data available.
          </p>
        )}
      </div>
    </div>
  );
}
