"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";

export default function ReceptionNewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", age: "", gender: "Male", phone: "",
    email: "", address: "", city: "", state: "", bloodGroup: "",
    admissionType: "OP", dob: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/reception/patients");
      } else {
        setError(data.error || "Failed to register patient");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">Register New Patient</h2>
      {error && <div className="p-3 bg-danger/10 text-danger rounded-md text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name *" required value={form.firstName} onChange={e => update("firstName", e.target.value)} />
            <Input label="Last Name *" required value={form.lastName} onChange={e => update("lastName", e.target.value)} />
            <Input label="Age *" type="number" required value={form.age} onChange={e => update("age", e.target.value)} />
            <div><label className="block text-sm font-medium text-text mb-1">Gender *</label>
              <select required value={form.gender} onChange={e => update("gender", e.target.value)} className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </select></div>
            <Input label="Date of Birth" type="date" value={form.dob} onChange={e => update("dob", e.target.value)} />
            <Input label="Phone *" required value={form.phone} onChange={e => update("phone", e.target.value)} />
            <Input label="Email" type="email" value={form.email} onChange={e => update("email", e.target.value)} />
            <Input label="Blood Group" value={form.bloodGroup} onChange={e => update("bloodGroup", e.target.value)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Address & Admission</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Address" value={form.address} onChange={e => update("address", e.target.value)} />
            <Input label="City" value={form.city} onChange={e => update("city", e.target.value)} />
            <Input label="State" value={form.state} onChange={e => update("state", e.target.value)} />
            <div><label className="block text-sm font-medium text-text mb-1">Admission Type</label>
              <select value={form.admissionType} onChange={e => update("admissionType", e.target.value)} className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="OP">Out Patient (OP)</option><option value="IP">In Patient (IP)</option>
              </select></div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" isLoading={loading}>Register Patient</Button>
        </div>
      </form>
    </div>
  );
}
