import { Metadata } from "next";
import AppointmentForm from "./AppointmentForm";

export const metadata: Metadata = {
  title: "Make an Appointment",
  description: "Schedule your naturopathy consultation at NIDARSANAM HEALTH CARE. Holistic treatments and natural healing.",
};

export default function AppointmentsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-dark via-primary to-bg-dark" />
        <div className="absolute inset-0 bg-leaf-pattern opacity-20" />
        <div className="relative z-10 text-center px-4 py-28">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white animate-fadeInUp">Make an Appointment</h1>
          <p className="text-white/60 mt-4 text-lg animate-fadeInUp delay-200">Take the first step towards natural healing</p>
        </div>
      </section>

      <section className="py-16 bg-bg bg-leaf-pattern">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentForm />
        </div>
      </section>
    </>
  );
}
