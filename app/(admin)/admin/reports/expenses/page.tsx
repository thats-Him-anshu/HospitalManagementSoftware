"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  Calendar,
  Filter,
  RefreshCw,
  TrendingDown,
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

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ExpenseReportPage() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/expenses?start=${startDate}&end=${endDate}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Client-side date filtering as fallback
        const filtered = data.data.filter((exp: any) => {
          const d = new Date(exp.date);
          return d >= new Date(startDate) && d <= new Date(endDate + "T23:59:59");
        });
        setExpenses(filtered);
      }
    } catch (err) {
      console.error("Error fetching expense data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Unique categories
  const categories = Array.from(
    new Set(expenses.map((e) => e.category).filter(Boolean))
  ).sort();

  // Filtered expenses
  const filteredExpenses =
    categoryFilter === "all"
      ? expenses
      : expenses.filter((e) => e.category === categoryFilter);

  // Total expenses in range
  const totalExpenses = filteredExpenses.reduce(
    (acc, e) => acc + (e.amount || 0),
    0
  );

  // Category-wise data for pie chart (always from all expenses, not filtered)
  const categoryData = (() => {
    const map: Record<string, number> = {};
    expenses.forEach((exp) => {
      const cat = exp.category || "Other";
      map[cat] = (map[cat] || 0) + (exp.amount || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  })();

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
            Expense Report
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Expense analysis with category breakdown and trends
          </p>
        </div>
      </div>

      {/* Filters */}
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
        <div>
          <label className="block text-sm text-text-muted mb-1">
            <Filter className="w-3.5 h-3.5 inline mr-1" />
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Apply Filter
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted">
              Total Expenses{" "}
              {categoryFilter !== "all" && (
                <span className="text-primary">({categoryFilter})</span>
              )}
            </p>
            <p className="text-3xl font-bold text-text">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {filteredExpenses.length} transactions in selected range
            </p>
          </div>
        </div>
      </div>

      {/* Category-wise Pie Chart */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <h2 className="font-semibold text-text mb-4 font-display">
          Category-wise Expense Distribution
        </h2>
        {categoryData.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categoryData.map((_, index) => (
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
              {categoryData.map((entry, index) => {
                const percentage =
                  totalExpenses > 0
                    ? ((entry.value / expenses.reduce((a, e) => a + (e.amount || 0), 0)) * 100).toFixed(1)
                    : "0";
                return (
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
                    <div className="text-right">
                      <span className="text-sm font-semibold text-text">
                        {formatCurrency(entry.value)}
                      </span>
                      <span className="text-xs text-text-muted ml-2">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-center py-12 text-text-muted">
            No expense data available.
          </p>
        )}
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-soft">
        <h2 className="font-semibold text-text mb-4 font-display">
          All Expenses
        </h2>
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Date
                  </th>
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Vendor
                  </th>
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExpenses.map((exp, i) => (
                  <tr key={exp._id || i} className="hover:bg-surface/50">
                    <td className="px-4 py-3 text-text">
                      {formatDate(exp.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-text">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-text">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {exp.vendor?.name || "—"}
                    </td>
                    <td className="px-4 py-3 capitalize text-text-muted">
                      {exp.paymentMethod || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-12 text-text-muted">
            No expenses found for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}
