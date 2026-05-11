"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal3D({
  children,
  className = "",
  delay = 0,
}: ScrollReveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [45, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        opacity,
        scale,
        y,
        transformPerspective: 1000,
      }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
