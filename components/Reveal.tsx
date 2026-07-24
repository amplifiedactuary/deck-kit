"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Step-reveal helper: fades/slides content in when `show` becomes true.
 * Hidden content still occupies layout space, so slides never reflow.
 * In safeMode the transition is instant (static rendering).
 */
export function Reveal({
  show,
  safeMode,
  delay = 0,
  y = 28,
  className,
  children,
}: {
  show: boolean;
  safeMode: boolean;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={
        safeMode
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: show ? delay : 0 }
      }
    >
      {children}
    </motion.div>
  );
}
