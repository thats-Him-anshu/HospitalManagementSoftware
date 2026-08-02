"use client";

import { useState, useEffect } from "react";
import {
  Receipt,
  TrendingUp,
  Calendar,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function IncomeReportPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/invoices?start=${startDate}&end=${endDate}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Filter by date range client-side as the API may not support start/end
        const filtered = data.data.filter((inv: any) => {
          const d = new Date(inv.createdAt);
          return d >= new Date(startDate) && d <= new Date(endDate + "T23:59:59");
        });
        setInvoices(filtered);
      }
    } catch (err) {
      console.error("Error fetching income data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Monthly income trend
  const monthlyTrend = (() => {
    const map: Record<string, number> = {};
    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + (inv.amountPaid || 0);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const [year, month] = key.split("-");
        return {
          name: `${MONTHS[parseInt(month) - 1]} ${year.slice(2)}`,
          revenue: value,
        };
      });
  })();

  // Top 10 revenue items
  const topItems = (() => {
    const itemMap: Record<string, { description: string; totalRevenue: number; count: number }> = {};
    invoices.forEach((inv) => {
      (inv.items || []).forEach((item: any) => {
        const desc = item.description || "Unnamed";
        if (!itemMap[desc]) {
          itemMap[desc] = { description: desc, totalRevenue: 0, count: 0 };
        }
        itemMap[desc].totalRevenue += item.total || 0;
        itemMap[desc].count += item.quantity || 1;
      });
    });
    return Object.values(itemMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);
  })();

  // Revenue by doctor (from issuedBy)
  const doctorRevenue = (() => {
    const map: Record<string, { name: string; revenue: number; invoiceCount: number }> = {};
    invoices.forEach((inv) => {
      const docName = inv.issuedBy?.name || "Unknown";
      const docId = inv.issuedBy?._id || "unknown";
      if (!map[docId]) {
        map[docId] = { name: docName, revenue: 0, invoiceCount: 0 };
      }
      map[docId].revenue += inv.amountPaid || 0;
      map[docId].invoiceCount += 1;
    });
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  })();

  const totalIncome = invoices.reduce(
    (acc, inv) => acc + (inv.amountPaid || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text">
            Income Report
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Revenue breakdown by treatment category and doctor
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-soft flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm text-text-muted mb-1">
            <Calendar className="w-3.5 h-3.5 inline mr-1" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">
            <Calendar className="w-3.5 h-3.5 inline mr-1" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Apply Filter
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm text-text-muted">Total Income</span>
          </div>
          <div className="text-2xl font-bold text-text">
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-sm text-text-muted">Total Invoices</span>
          </div>
          <div className="text-2xl font-bold text-text">
            {invoices.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm text-text-muted">Avg. Per Invoice</span>
          </div>
          <div className="text-2xl font-bold text-text">
            {formatCurrency(invoices.length > 0 ? totalIncome / invoices.length : 0)}
          </div>
        </div>
      </div>

      {/* Monthly Income Trend Chart */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <h2 className="font-semibold text-text mb-4 font-display">
          Monthly Income Trend
        </h2>
        {monthlyTrend.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  tickFormatter={(v) =>
                    `₹${(v / 1000).toFixed(0)}k`
                  }
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4A6741"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#4A6741" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center py-12 text-text-muted">
            No income data available for this period.
          </p>
        )}
      </div>

      {/* Revenue by Staff */}
      {doctorRevenue.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
          <h2 className="font-semibold text-text mb-4 font-display">
            Revenue by Staff
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium text-text-muted">#</th>
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Staff Name
                  </th>
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Invoices
                  </th>
                  <th className="px-4 py-3 font-medium text-text-muted text-right">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {doctorRevenue.map((doc, i) => (
                  <tr key={i} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-text-muted">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-text">
                      {doc.name}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {doc.invoiceCount}
                    </td>
                    <td className="px-4 py-3 font-semibold text-text text-right">
                      {formatCurrency(doc.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top 10 Revenue-Generating Items */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <h2 className="font-semibold text-text mb-4 font-display">
          Top 10 Revenue-Generating Items
        </h2>
        {topItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium text-text-muted">#</th>
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Item / Treatment
                  </th>
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Qty Sold
                  </th>
                  <th className="px-4 py-3 font-medium text-text-muted text-right">
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topItems.map((item, i) => (
                  <tr key={i} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-text-muted">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-text">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-text-muted">{item.count}</td>
                    <td className="px-4 py-3 font-semibold text-text text-right">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-12 text-text-muted">
            No item data available for this period.
          </p>
        )}
      </div>
    </div>
  );
}
