"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

const patientSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.coerce.number().min(1, "Valid age is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().optional(),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relation: z.string().optional(),
  }).optional(),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(), // Will split by comma on submit
  chronicConditions: z.string().optional(), // Will split by comma on submit
  admissionType: z.enum(["IP", "OP"]).optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema) as any,
    defaultValues: {
      gender: "Male",
      admissionType: "OP",
      emergencyContact: { name: "", phone: "", relation: "" },
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    setLoading(true);
    setError("");
    try {
      // Format arrays
      const formattedData = {
        ...data,
        allergies: data.allergies ? data.allergies.split(",").map(a => a.trim()).filter(Boolean) : [],
        chronicConditions: data.chronicConditions ? data.chronicConditions.split(",").map(c => c.trim()).filter(Boolean) : [],
      };

      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();
      if (result.success) {
        router.push(`/admin/patients/${result.data._id}`);
      } else {
        setError(result.error || "Failed to register patient");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-text">Register New Patient</h2>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 text-danger rounded-md border border-danger/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name *" error={errors.firstName?.message} {...register("firstName")} />
            <Input label="Last Name *" error={errors.lastName?.message} {...register("lastName")} />
            <Input label="Age *" type="number" error={errors.age?.message} {...register("age")} />
            
            <div className="w-full">
              <label className="block text-sm font-medium text-text mb-1">Gender *</label>
              <select
                {...register("gender")}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input label="Date of Birth" type="date" {...register("dob")} />
            <Input label="Phone Number *" error={errors.phone?.message} {...register("phone")} />
            <Input label="Email Address" type="email" error={errors.email?.message} {...register("email")} />
            <Input label="Blood Group" {...register("bloodGroup")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <Input label="Full Address" {...register("address")} />
            </div>
            <Input label="City" {...register("city")} />
            <Input label="State" {...register("state")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Allergies (comma separated)</label>
              <textarea
                {...register("allergies")}
                className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
                placeholder="e.g. Peanuts, Dust, Penicillin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Chronic Conditions (comma separated)</label>
              <textarea
                {...register("chronicConditions")}
                className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
                placeholder="e.g. Diabetes, Hypertension, Asthma"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Contact Name" {...register("emergencyContact.name")} />
            <Input label="Contact Phone" {...register("emergencyContact.phone")} />
            <Input label="Relation" {...register("emergencyContact.relation")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admission Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" value="OP" {...register("admissionType")} className="text-primary focus:ring-primary h-4 w-4" />
                <span className="text-sm font-medium">Out-Patient (OPD)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="IP" {...register("admissionType")} className="text-primary focus:ring-primary h-4 w-4" />
                <span className="text-sm font-medium">In-Patient (Admission)</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" isLoading={loading}>
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  );
}
