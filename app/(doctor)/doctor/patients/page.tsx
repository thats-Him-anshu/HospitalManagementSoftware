"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/shared/Card";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch("/api/patients?scope=mine");
        const data = await res.json();
        if (data.success) setPatients(data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchPatients();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">My Patients</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Patient ID</th>
                <th className="px-6 py-4 font-medium text-text-muted">Name</th>
                <th className="px-6 py-4 font-medium text-text-muted">Age / Gender</th>
                <th className="px-6 py-4 font-medium text-text-muted">Phone</th>
                <th className="px-6 py-4 font-medium text-text-muted">Type</th>
                <th className="px-6 py-4 font-medium text-text-muted text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-text-muted">Loading...</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-text-muted">No patients assigned.</td></tr>
              ) : patients.map((p) => (
                <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-text-muted">{p.patientId}</td>
                  <td className="px-6 py-4 font-medium text-text">{p.firstName} {p.lastName}</td>
                  <td className="px-6 py-4 text-text-muted">{p.age} / {p.gender}</td>
                  <td className="px-6 py-4 text-text-muted">{p.phone}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${p.admissionType === "IP" ? "bg-purple-100 text-purple-700" : "bg-teal-100 text-teal-700"}`}>{p.admissionType || "OP"}</span></td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/doctor/patients/${p._id}`} className="p-1.5 text-text-muted hover:text-blue-600 transition-colors inline-block"><Eye className="h-4 w-4" /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
