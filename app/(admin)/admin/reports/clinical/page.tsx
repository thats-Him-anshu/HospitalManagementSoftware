"use client";

import { useState, useEffect } from "react";

interface Admission {
  _id: string;
  patientName: string;
  patientId: string;
  admissionDate: string;
  dischargeDate?: string;
  doctor: string;
  room?: string;
  type: "IP" | "OP";
  status: "active" | "discharged";
  amountPaid?: number;
  totalAmount?: number;
  daysAdmitted?: number;
}

type TabType = "IP" | "OP";
type StatusFilter = "all" | "active" | "discharged";

function daysBetween(start: string, end?: string) {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ClinicalReportPage() {
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const defaultEnd = now.toISOString().split("T")[0];

  const [tab, setTab] = useState<TabType>("IP");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admissions?start=${startDate}&end=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        setAdmissions(Array.isArray(data) ? data : data.admissions ?? []);
      } else {
        setAdmissions([]);
      }
    } catch {
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = admissions.filter((a) => {
    const typeMatch = a.type === tab;
    const statusMatch = statusFilter === "all" || a.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const ipActive = admissions.filter((a) => a.type === "IP" && a.status === "active").length;
  const opActive = admissions.filter((a) => a.type === "OP" && a.status === "active").length;

  const activeAdmissions = admissions.filter((a) => a.status === "active");
  const avgStay =
    activeAdmissions.length > 0
      ? (
          activeAdmissions.reduce(
            (sum, a) => sum + (a.daysAdmitted ?? daysBetween(a.admissionDate)),
            0
          ) / activeAdmissions.length
        ).toFixed(1)
      : "0";

  const tabs: { label: string; value: TabType }[] = [
    { label: "Inpatients (IP)", value: "IP" },
    { label: "Outpatients (OP)", value: "OP" },
  ];

  const statusBadge = (status: string) => {
    const isActive = status === "active";
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {isActive ? "Active" : "Discharged"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text">Clinical IP/OP Report</h1>
        <p className="text-text-muted text-sm mt-1">Inpatient and outpatient admission records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border shadow-soft p-5">
          <p className="text-text-muted text-sm">Total Active IP</p>
          <p className="text-3xl font-display font-bold text-text mt-1">{ipActive}</p>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-soft p-5">
          <p className="text-text-muted text-sm">Total Active OP</p>
          <p className="text-3xl font-display font-bold text-text mt-1">{opActive}</p>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-soft p-5">
          <p className="text-text-muted text-sm">Avg. Stay Duration</p>
          <p className="text-3xl font-display font-bold text-text mt-1">
            {avgStay} <span className="text-base text-text-muted font-normal">days</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border shadow-soft p-5 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>
      </div>

      {/* Tabs + Table */}
      <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                tab === t.value
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-text-muted hover:text-text hover:bg-surface/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-text-muted text-sm">
            No {tab === "IP" ? "inpatient" : "outpatient"} records found for the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-text-muted text-left">
                  <th className="px-6 py-3 font-medium">Patient Name</th>
                  <th className="px-6 py-3 font-medium">Patient ID</th>
                  <th className="px-6 py-3 font-medium">Admission Date</th>
                  <th className="px-6 py-3 font-medium">Doctor</th>
                  <th className="px-6 py-3 font-medium">Room</th>
                  <th className="px-6 py-3 font-medium">Days Admitted</th>
                  <th className="px-6 py-3 font-medium">Amount Paid</th>
                  <th className="px-6 py-3 font-medium">Balance</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => {
                  const days = a.daysAdmitted ?? daysBetween(a.admissionDate, a.dischargeDate);
                  const paid = a.amountPaid ?? 0;
                  const total = a.totalAmount ?? 0;
                  const balance = total - paid;

                  return (
                    <tr key={a._id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-3 text-text font-medium">{a.patientName}</td>
                      <td className="px-6 py-3 text-text-muted font-mono text-xs">{a.patientId}</td>
                      <td className="px-6 py-3 text-text-muted">
                        {new Date(a.admissionDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-3 text-text">{a.doctor}</td>
                      <td className="px-6 py-3 text-text-muted">{a.room ?? "—"}</td>
                      <td className="px-6 py-3 text-text">{days}</td>
                      <td className="px-6 py-3 text-text">{formatCurrency(paid)}</td>
                      <td className="px-6 py-3">
                        <span className={balance > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                          {formatCurrency(balance)}
                        </span>
                      </td>
                      <td className="px-6 py-3">{statusBadge(a.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
