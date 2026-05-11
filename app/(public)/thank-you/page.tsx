"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Home, Calendar } from "lucide-react";

export default function ThankYouPage() {
  return (
    <section className="min-h-screen flex items-center justify-center gradient-green pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12 text-medical-300" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Thank You!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-earth-100 mb-10 max-w-lg mx-auto"
        >
          Your message has been received. Our team will get back to you within
          24 hours. For emergencies, please call our hotline directly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-medical-800 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
          >
            <Calendar className="w-5 h-5" />
            Book Appointment
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <p className="text-earth-200 text-sm">
            Need immediate assistance? Call us at{" "}
            <a href="tel:+1234567890" className="text-white font-semibold hover:underline">
              +1 (234) 567-890
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
