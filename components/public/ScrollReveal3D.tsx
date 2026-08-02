"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollReveal3DProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function ScrollReveal3D({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollReveal3DProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 32, x: 0 };
      case "down":
        return { y: -32, x: 0 };
      case "left":
        return { x: 32, y: 0 };
      case "right":
        return { x: -32, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.97,
        ...initialPos,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Modern Apple/Linear style cubic bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
