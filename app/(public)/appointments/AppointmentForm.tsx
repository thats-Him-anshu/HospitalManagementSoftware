"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Phone, Mail, User, MessageSquare, Leaf, ArrowRight } from "lucide-react";

export default function AppointmentForm() {
  const router = useRouter();
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", preferredDate: "", preferredTime: "", treatmentInterest: "", message: "",
  });

  useEffect(() => {
    async function f() {
      try {
        const res = await fetch("/api/treatment-prices");
        const data = await res.json();
        if (data.success) setTreatments(data.data.filter((t: any) => t.isActive));
      } catch (e) { console.error(e); }
    }
    f();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/public/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("appointmentSubmitted", "true");
        router.push("/appointments/thank-you");
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 sm:p-10 border border-border/50 shadow-lg space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3"><Leaf className="h-6 w-6 text-primary" /></div>
        <h2 className="text-2xl font-display font-bold text-text">Book Your Visit</h2>
        <p className="text-sm text-text-muted mt-1">Fill in your details and we&apos;ll get back to you within 24 hours</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5"><User className="h-3.5 w-3.5 text-primary" />Full Name *</label>
          <input required type="text" value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your full name" className="w-full h-12 rounded-xl border border-border bg-surface/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5"><Phone className="h-3.5 w-3.5 text-primary" />Phone *</label>
          <input required type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="Your phone number" className="w-full h-12 rounded-xl border border-border bg-surface/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5"><Mail className="h-3.5 w-3.5 text-primary" />Email</label>
          <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="Your email address" className="w-full h-12 rounded-xl border border-border bg-surface/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />Preferred Date</label>
          <input type="date" value={form.preferredDate} onChange={e => update("preferredDate", e.target.value)} className="w-full h-12 rounded-xl border border-border bg-surface/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5"><Clock className="h-3.5 w-3.5 text-primary" />Preferred Time</label>
          <select value={form.preferredTime} onChange={e => update("preferredTime", e.target.value)} className="w-full h-12 rounded-xl border border-border bg-surface/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
            <option value="">Select time</option>
            <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option>
            <option>02:00 PM</option><option>03:00 PM</option><option>04:00 PM</option><option>05:00 PM</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5"><Leaf className="h-3.5 w-3.5 text-primary" />Treatment Interest</label>
          <select value={form.treatmentInterest} onChange={e => update("treatmentInterest", e.target.value)} className="w-full h-12 rounded-xl border border-border bg-surface/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
            <option value="">Select treatment</option>
            {treatments.map(t => <option key={t._id} value={t.treatmentName}>{t.treatmentName}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5"><MessageSquare className="h-3.5 w-3.5 text-primary" />Message</label>
        <textarea rows={3} value={form.message} onChange={e => update("message", e.target.value)} placeholder="Any specific concerns or questions..." className="w-full rounded-xl border border-border bg-surface/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
      </div>

      <button type="submit" disabled={loading} className="w-full h-14 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg flex items-center justify-center gap-2 text-lg disabled:opacity-50">
        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><ArrowRight className="h-5 w-5" />Submit Appointment Request</>}
      </button>
    </form>
  );
}
