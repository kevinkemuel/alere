"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/motion/Magnetic";
import { Counter } from "@/components/motion/Counter";
import { Marquee } from "@/components/motion/Marquee";
import { ChevronMark, SectionEdge } from "@/components/ui/Chevron";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappUrl, defaultWhatsappMessage } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

const KEYWORDS = [
  "Reactivos",
  "Consumibles",
  "Cristalería",
  "Equipos",
  "Bioseguridad",
  "Microtubos",
  "Tubos al vacío",
  "Medios de cultivo",
];

const STATS = [
  { to: 500, suffix: "+", label: "Referencias" },
  { to: 8, suffix: "", label: "Líneas de producto" },
  { to: 48, suffix: "h", label: "Entrega típica" },
  { to: 100, suffix: "%", label: "Con respaldo" },
];

const HERO_LINES = [
  { text: "Insumos para laboratorio", grad: false },
  { text: "de alta calidad", grad: false },
  { text: "y precisión.", grad: true },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const isoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 240]);
  const isoRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 12]);
  const isoScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  let wordIndex = 0;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink-gradient text-white"
    >
      {/* Rejilla de puntos + halos magenta */}
      <div aria-hidden className="dot-grid-dark absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[8%] h-[38rem] w-[38rem] rounded-full bg-magenta-600/30 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[30rem] w-[30rem] rounded-full bg-magenta-glow/10 blur-[120px]"
      />

      <Container className="relative grid items-center gap-10 pb-16 pt-32 md:grid-cols-[1.15fr_0.85fr] md:pb-24 md:pt-40">
        <motion.div style={{ y: textY, opacity: textOpacity }}>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="label flex items-center gap-2 text-magenta-glow"
          >
            <ChevronMark className="h-3.5 w-3.5" />
            Laboratorio y Suministros
          </motion.p>

          <h1 className="font-display mt-6 text-[clamp(2.6rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-tight">
            {HERO_LINES.map((line) => (
              <span key={line.text} className="block">
                {line.text.split(" ").map((word) => {
                  const idx = wordIndex++;
                  return (
                    <motion.span
                      key={`${word}-${idx}`}
                      className={`inline-block ${line.grad ? "text-brand-gradient" : ""}`}
                      initial={
                        reduce
                          ? false
                          : { opacity: 0, y: "0.5em", filter: "blur(12px)" }
                      }
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.2 + idx * 0.09 }}
                    >
                      {word}
                      {" "}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/70"
          >
            Distribuimos reactivos, consumibles y equipos para laboratorios
            clínicos. Contamos con un amplio portafolio con{" "}
            <span className="text-white">precios y disponibilidad</span>.
            Contáctanos y solicita tu cotización directa por WhatsApp.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link
                href="/catalogo"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-ink transition-colors hover:bg-magenta-50"
              >
                Ver catálogo
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={whatsappUrl(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 font-semibold text-white transition-colors hover:border-white/60"
              >
                <WhatsAppIcon className="h-5 w-5" /> Cotizar por WhatsApp
              </a>
            </Magnetic>
          </motion.div>

          {/* Stats con contadores */}
          <dl className="mt-14 grid max-w-xl grid-cols-2 gap-x-6 gap-y-6 border-t border-line-dark pt-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  <Counter to={s.to} suffix={s.suffix} />
                </dt>
                <dd className="label mt-1 text-white/45">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Isotipo con parallax */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-md md:block">
          <motion.div
            aria-hidden
            className="absolute inset-8 rounded-full bg-magenta-500/25 blur-3xl"
            animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            style={{ y: isoY, rotate: isoRotate, scale: isoScale }}
            className="relative"
          >
            <Image
              src="/brand/alere-iso-silver.png"
              width={1127}
              height={971}
              alt=""
              priority
              className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>
      </Container>

      {/* Marquee de categorías */}
      <div className="relative border-y border-line-dark py-4">
        <Marquee>
          {KEYWORDS.map((k) => (
            <span
              key={k}
              className="label mx-6 inline-flex items-center gap-3 text-white/50"
            >
              {k}
              <ChevronMark className="h-3 w-3 text-magenta-glow" />
            </span>
          ))}
        </Marquee>
      </div>

      <SectionEdge position="bottom" colorClass="text-paper" />
    </section>
  );
}
