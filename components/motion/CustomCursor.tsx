"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Cursor personalizado (máximo impacto).
 * Un punto que sigue exacto + un anillo con retardo que crece sobre
 * elementos interactivos. Sólo en punteros finos (mouse) y si el usuario
 * no pidió reducir el movimiento. Oculta el cursor nativo mientras está activo.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    document.documentElement.style.cursor = "none";

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const interactive = !!(e.target as Element)?.closest?.(
        'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'
      );
      setHovering(interactive);
    };
    const downH = () => setDown(true);
    const upH = () => setDown(false);
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", downH);
    window.addEventListener("mouseup", upH);
    document.addEventListener("mouseleave", leave);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", downH);
      window.removeEventListener("mouseup", upH);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
      {/* Anillo con retardo */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute left-0 top-0 -ml-4 -mt-4"
      >
        <motion.div
          animate={{
            scale: down ? 0.8 : hovering ? 1.8 : 1,
            opacity: hovering ? 1 : 0.6,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="h-8 w-8 rounded-full border border-magenta-500"
        />
      </motion.div>
      {/* Punto exacto */}
      <motion.div
        style={{ x, y }}
        className="absolute left-0 top-0 -ml-1 -mt-1"
      >
        <motion.div
          animate={{ scale: hovering ? 0 : 1 }}
          className="h-2 w-2 rounded-full bg-magenta-500"
        />
      </motion.div>
    </div>
  );
}
