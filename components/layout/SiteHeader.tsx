"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/motion/Magnetic";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useQuote } from "@/lib/quote/QuoteContext";
import { whatsappUrl, defaultWhatsappMessage } from "@/lib/site";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/aliados", label: "Aliados" },
];

const DARK_HERO = new Set(["/", "/nosotros"]);

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useQuote();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const overHero = DARK_HERO.has(pathname) && !scrolled && !open;
  const light = overHero; // texto claro cuando estamos sobre el hero oscuro

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        overHero
          ? "bg-transparent"
          : "border-b border-line bg-paper/80 backdrop-blur-xl"
      }`}
    >
      <Container className="flex h-18 items-center justify-between">
        <Link href="/" aria-label="Ir al inicio" className="shrink-0">
          <Logo
            variant={light ? "white" : "magenta"}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                  light
                    ? "text-white/80 hover:text-white"
                    : active
                      ? "text-magenta-600"
                      : "text-ink/70 hover:text-ink"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-4 -bottom-px h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    light ? "bg-white" : "bg-magenta-500"
                  } ${active && !light ? "scale-x-100" : ""}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Indicador de cotización */}
          {count > 0 && (
            <Link
              href="/cotizar"
              aria-label={`${count} productos en tu cotización`}
              className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
                light
                  ? "bg-white/15 text-white"
                  : "bg-magenta-50 text-magenta-600"
              }`}
            >
              <span className="index-num">{count}</span> en cotización
            </Link>
          )}

          <a
            href={whatsappUrl(defaultWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className={`hidden h-10 w-10 items-center justify-center rounded-full transition-colors sm:flex ${
              light
                ? "text-white hover:bg-white/15"
                : "text-[#1fae55] hover:bg-magenta-50"
            }`}
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>

          {/* El wrapper controla la visibilidad; Magnetic fuerza display inline
              por style y anularía un `hidden` puesto directamente sobre él. */}
          <div className="hidden sm:block">
            <Magnetic>
              <Link
                href="/cotizar"
                className={`group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  light
                    ? "bg-white text-ink hover:bg-magenta-50"
                    : "bg-magenta-500 text-white hover:bg-magenta-600"
                }`}
              >
                Cotizar
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className={`flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${
              light ? "text-white hover:bg-white/15" : "text-ink hover:bg-paper-2"
            }`}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Barra de progreso de scroll */}
      <motion.div
        style={{ scaleX: progress }}
        className="h-px origin-left bg-gradient-to-r from-magenta-500 to-magenta-glow"
      />

      {/* Menú móvil */}
      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <Container className="flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center border-b border-line py-4 text-lg font-medium ${
                  isActive(item.href) ? "text-magenta-600" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/cotizar"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-magenta-500 px-6 py-3.5 font-semibold text-white hover:bg-magenta-600"
              >
                Solicitar cotización
                {count > 0 && (
                  <span className="index-num rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {count}
                  </span>
                )}
              </Link>
              <a
                href={whatsappUrl(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white"
              >
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp
              </a>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
