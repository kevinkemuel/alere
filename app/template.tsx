"use client";

import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";

/**
 * Transición de entrada entre páginas. Sólo anima opacidad (sin transform)
 * para no crear un containing-block que afecte a elementos fixed/sticky.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
