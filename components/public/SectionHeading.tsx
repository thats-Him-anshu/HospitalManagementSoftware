"use client";

import { motion } from "framer-motion";
import ScrollReveal3D from "./ScrollReveal3D";

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
  return (
    <ScrollReveal3D
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-block text-sm font-semibold tracking-widest uppercase mb-3 ${
            light ? "text-medical-300" : "text-medical-600"
          }`}
        >
          {subtitle}
        </motion.span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
          light ? "text-white" : "text-medical-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-lg max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-earth-100" : "text-gray-600"}`}
        >
          {description}
        </p>
      )}
    </ScrollReveal3D>
  );
}
