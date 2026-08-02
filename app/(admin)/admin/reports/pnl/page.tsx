"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface DashboardData {
  totalRevenue?: number;
  totalExpenses?: number;
  invoiceRevenue?: number;
  pharmacyRevenue?: number;
  monthlyData?: MonthlyData[];
  grossProfit?: number;
  netProfit?: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProfitAndLossPage() {
  const now = new Date();
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMonth, endMonth, year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/dashboard?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}`
      );
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData(null);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = data?.totalRevenue ?? 0;
  const totalExpenses = data?.totalExpenses ?? 0;
  const grossProfit = data?.grossProfit ?? totalRevenue - totalExpenses;
  const netProfit = data?.netProfit ?? grossProfit;

  const chartData: MonthlyData[] =
    data?.monthlyData ??
    SHORT_MONTHS.slice(startMonth, endMonth + 1).map((m) => ({
      month: m,
      revenue: 0,
      expenses: 0,
    }));

  const summaryCards = [
    { label: "Total Revenue", value: totalRevenue, color: "text-green-700", bg: "bg-green-50" },
    { label: "Total Expenses", value: totalExpenses, color: "text-red-700", bg: "bg-red-50" },
    { label: "Gross Profit", value: grossProfit, color: grossProfit >= 0 ? "text-green-700" : "text-red-700", bg: grossProfit >= 0 ? "bg-green-50" : "bg-red-50" },
    { label: "Net Profit", value: netProfit, color: netProfit >= 0 ? "text-green-700" : "text-red-700", bg: netProfit >= 0 ? "bg-green-50" : "bg-red-50" },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Profit &amp; Loss Report</h1>
          <p className="text-text-muted text-sm mt-1">Revenue vs expenses overview</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border shadow-soft p-5 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">From Month</label>
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(Number(e.target.value))}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">To Month</label>
          <select
            value={endMonth}
            onChange={(e) => setEndMonth(Number(e.target.value))}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card) => (
              <div key={card.label} className="bg-white rounded-xl border border-border shadow-soft p-5">
                <p className="text-text-muted text-sm">{card.label}</p>
                <p className={`text-2xl font-display font-bold mt-1 ${card.color}`}>
                  {formatCurrency(card.value)}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border border-border shadow-soft p-6">
            <h2 className="text-lg font-display font-semibold text-text mb-4">
              Monthly Revenue vs Expenses
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#d1d5db" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#d1d5db" }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#4A6741" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#C0392B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
