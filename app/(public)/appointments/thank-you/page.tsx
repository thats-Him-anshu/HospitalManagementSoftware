"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Phone, MessageCircle, Home } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const submitted = sessionStorage.getItem("appointmentSubmitted");
    if (!submitted) {
      router.replace("/appointments");
    } else {
      setAuthorized(true);
      sessionStorage.removeItem("appointmentSubmitted");
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <section className="min-h-screen bg-bg bg-leaf-pattern flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full bg-white rounded-3xl p-10 sm:p-14 border border-border/50 shadow-xl text-center">
        <div className="relative h-16 w-16 mx-auto mb-6">
          <Image src="/assets/logo.png" alt="NIDARSANAM HEALTH CARE" fill className="object-contain" />
        </div>
        <h2 className="text-xl font-display font-bold text-primary uppercase tracking-wider">NIDARSANAM HEALTH CARE</h2>
        <p className="text-xs text-text-muted uppercase tracking-widest mt-1">Natural Healing. Real Results.</p>

        <div className="mt-8">
          <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-text">Thank You!</h1>
          <p className="text-text-muted mt-4 leading-relaxed">
            Your appointment request has been received successfully. Our team will contact you within <strong className="text-text">24 hours</strong> to confirm your appointment.
          </p>
        </div>

        <div className="mt-8 p-4 bg-surface rounded-xl border border-border/50">
          <p className="text-sm text-text-muted mb-2">Need immediate assistance?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:9952338765" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              <Phone className="h-4 w-4" />Call: 9952338765
            </a>
            <a href="https://wa.me/919952338765" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
              <MessageCircle className="h-4 w-4" />WhatsApp
            </a>
          </div>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-surface hover:bg-border/50 text-text rounded-full text-sm font-medium transition-colors">
          <Home className="h-4 w-4" />Go Back to Home
        </Link>
      </div>
    </section>
  );
}
