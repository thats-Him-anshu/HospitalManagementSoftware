"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";

export default function TherapistPatientDetailPage() {
  const params = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function f() {
      try {
        const res = await fetch(`/api/patients/${params.id}`);
        const data = await res.json();
        if (data.success) setPatient(data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    f();
  }, [params.id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;
  if (!patient) return <p className="text-text-muted">Patient not found.</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-display font-semibold text-text">{patient.firstName} {patient.lastName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium text-text-muted">ID:</span> {patient.patientId}</p>
            <p><span className="font-medium text-text-muted">Age:</span> {patient.age} / {patient.gender}</p>
            <p><span className="font-medium text-text-muted">Phone:</span> {patient.phone}</p>
            <p><span className="font-medium text-text-muted">Blood Group:</span> {patient.bloodGroup || "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Medical Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium text-text-muted">Type:</span> {patient.admissionType || "OP"}</p>
            <p><span className="font-medium text-text-muted">Allergies:</span> {(patient.allergies || []).join(", ") || "None"}</p>
            <p><span className="font-medium text-text-muted">Chronic Conditions:</span> {(patient.chronicConditions || []).join(", ") || "None"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
