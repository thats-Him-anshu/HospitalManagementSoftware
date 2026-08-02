"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Home, Calendar, Phone } from "lucide-react";

export default function ThankYouPage() {
  return (
    <section className="min-h-screen flex items-center justify-center gradient-hero pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-md"
        >
          <CheckCircle className="w-10 h-10 text-medical-300" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-4xl md:text-5xl font-bold mb-4 font-display"
        >
          Thank You!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-base sm:text-lg text-medical-100/90 mb-8 max-w-lg mx-auto leading-relaxed"
        >
          Your enquiry has been received by Nidarsanam Health Care. Our team will contact you shortly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-medical-900 font-bold text-sm shadow-lg hover:bg-medical-50 transition-all"
          >
            <Home className="w-4 h-4 text-medical-700" />
            Back to Home
          </Link>
          <a
            href="tel:9952338765"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
          >
            <Phone className="w-4 h-4 text-medical-300" />
            Call: 9952338765
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15"
        >
          <p className="text-medical-100/90 text-xs sm:text-sm">
            Need urgent assistance? Call Dr. Nidarsin's team directly at{" "}
            <a href="tel:9952338765" className="text-white font-bold hover:underline">
              9952338765
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
