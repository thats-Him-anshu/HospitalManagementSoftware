"use client";

import { useEffect, useState } from "react";
import { Plus, Eye, Search } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import Link from "next/link";
import { format } from "date-fns";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients?search=${search}`);
      const data = await res.json();
      if (data.success) {
        setPatients(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-display font-semibold text-text">
          Patients Directory
        </h2>
        <Link href="/admin/patients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Register Patient
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2 bg-white">
          <Search className="h-5 w-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border text-text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Patient ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Age/Gender</th>
                <th className="px-6 py-4 font-medium">Registered On</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                    Loading patients...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-primary">{p.patientId}</td>
                    <td className="px-6 py-4 font-medium text-text">{p.firstName} {p.lastName}</td>
                    <td className="px-6 py-4 text-text-muted">{p.phone}</td>
                    <td className="px-6 py-4 text-text-muted">{p.age} / {p.gender}</td>
                    <td className="px-6 py-4 text-text-muted">{format(new Date(p.createdAt), "dd MMM yyyy")}</td>
                    <td className="px-6 py-4">
                      {p.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/patients/${p._id}`}>
                        <button className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-surface">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
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
