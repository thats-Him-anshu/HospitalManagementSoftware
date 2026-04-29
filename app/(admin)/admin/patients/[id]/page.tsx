"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { ArrowLeft, Edit, Calendar, User, Phone, MapPin, Activity, BedDouble } from "lucide-react";
import { format } from "date-fns";

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await fetch(`/api/patients/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setPatient(data.data);
        } else {
          setError(data.error || "Patient not found");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchPatient();
    }
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-12">Loading patient data...</div>;
  }

  if (error || !patient) {
    return (
      <div className="text-center py-12 text-danger">
        {error || "Patient not found"}
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="px-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-display font-semibold text-text flex items-center gap-3">
              {patient.firstName} {patient.lastName}
              <span className="text-sm font-mono font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                {patient.patientId}
              </span>
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Registered on {format(new Date(patient.createdAt), "dd MMM yyyy")}
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" /> Edit Details
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Summary */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">Age / Gender</p>
                <p className="text-sm text-text">{patient.age} yrs, {patient.gender}</p>
              </div>
              {patient.dob && (
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="text-sm text-text">{format(new Date(patient.dob), "dd MMM yyyy")}</p>
                </div>
              )}
              {patient.bloodGroup && (
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">Blood Group</p>
                  <p className="text-sm text-text font-medium text-danger">{patient.bloodGroup}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">Status</p>
                {patient.isActive ? (
                  <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger">
                    Inactive
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" /> Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm text-text">{patient.phone}</p>
              </div>
              {patient.email && (
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-text break-all">{patient.email}</p>
                </div>
              )}
              <div className="pt-2">
                <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</p>
                <p className="text-sm text-text">
                  {patient.address || "No address provided."}
                  {patient.city && `, ${patient.city}`}
                  {patient.state && `, ${patient.state}`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Medical Info & Records */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader className="pb-3 border-b border-border bg-surface/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-danger" /> Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-text mb-2">Allergies</h4>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-100">
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted italic">None reported</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-text mb-2">Chronic Conditions</h4>
                {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-text space-y-1">
                    {patient.chronicConditions.map((condition: string, i: number) => (
                      <li key={i}>{condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-text-muted italic">None reported</p>
                )}
              </div>
            </CardContent>
          </Card>

          {patient.emergencyContact?.name && (
            <Card>
              <CardHeader className="pb-3 border-b border-border bg-warning/5">
                <CardTitle className="text-lg text-warning-dark">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase">Name</p>
                  <p className="text-sm text-text">{patient.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase">Relation</p>
                  <p className="text-sm text-text">{patient.emergencyContact.relation || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium uppercase">Phone</p>
                  <p className="text-sm text-text">{patient.emergencyContact.phone || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Card className="hover:border-primary/50 cursor-pointer transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted mb-1">Admission Status</p>
                  <p className="text-xl font-bold text-text">{patient.admissionType || "None"}</p>
                </div>
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <BedDouble className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 cursor-pointer transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted mb-1">Appointments</p>
                  <p className="text-xl font-bold text-text">View All</p>
                </div>
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
