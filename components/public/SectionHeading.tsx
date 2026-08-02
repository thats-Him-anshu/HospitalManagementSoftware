"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? "text-center" : "text-left"}`}>
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border ${
            isCenter ? "mx-auto" : ""
          } ${
            light
              ? "bg-white/10 text-medical-200 border-white/20 backdrop-blur-md"
              : "bg-medical-50 text-medical-800 border-medical-200/80"
          }`}
        >
          <span className={`w-2 h-2 rounded-full animate-pulse ${light ? "bg-medical-300" : "bg-medical-600"}`} />
          <span>{subtitle}</span>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-display ${
          light ? "text-white" : "text-medical-900"
        }`}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={`text-base sm:text-lg mt-4 max-w-2xl leading-relaxed ${
            isCenter ? "mx-auto" : ""
          } ${light ? "text-medical-100/90" : "text-gray-600"}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
