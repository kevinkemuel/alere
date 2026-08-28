import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";
import { site, whatsappUrl, defaultWhatsappMessage } from "@/lib/site";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/aliados", label: "Aliados" },
  { href: "/cotizar", label: "Cotizar / Contacto" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-white">
      <div aria-hidden className="dot-grid-dark absolute inset-0 opacity-40" />
      <Image
        src="/brand/alere-iso-white.png"
        width={1127}
        height={972}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 w-96 opacity-[0.05]"
      />

      {/* CTA superior */}
      <Container className="relative border-b border-line-dark py-16">
        <p className="label text-magenta-glow">¿Empezamos?</p>
        <div className="mt-5 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="font-display max-w-2xl text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-tight">
            Abastece tu laboratorio, sin fricción.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/cotizar"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-magenta-50"
            >
              Solicitar cotización
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href={whatsappUrl(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold transition-colors hover:border-white/60"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </a>
          </div>
        </div>
      </Container>

      {/* Cuerpo */}
      <Container className="relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Logo variant="white" className="h-10 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            Suministros confiables para laboratorios clínicos: reactivos,
            consumibles, cristalería, equipos y bioseguridad.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={whatsappUrl(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-dark text-white transition-colors hover:border-white/50 hover:bg-white/5"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            {site.social.instagram && (
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line-dark text-white transition-colors hover:border-white/50 hover:bg-white/5"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="label text-white/40">Navegación</h3>
          <ul className="mt-5 space-y-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-white/75 transition-colors hover:text-white"
                >
                  <span className="h-px w-0 bg-magenta-glow transition-all duration-300 group-hover:w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label text-white/40">Contacto</h3>
          <ul className="mt-5 space-y-4 text-sm text-white/75">
            <li className="flex items-start gap-3">
              <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-magenta-glow" />
              <a
                href={whatsappUrl(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:text-white"
              >
                {site.contact.whatsappLabel}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-magenta-glow" />
              <a href={`mailto:${site.contact.email}`} className="hover:text-white">
                {site.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-magenta-glow" />
              <span className="font-mono">{site.contact.phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-magenta-glow" />
              <span>
                {site.contact.address} · {site.contact.coverage}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-magenta-glow" />
              <span>{site.contact.hours}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="relative border-t border-line-dark">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/45 sm:flex-row">
          <p className="font-mono">
            © {year} {site.legalName}
          </p>
          <p className="font-mono">Precios y disponibilidad actualizados</p>
        </Container>
      </div>
    </footer>
  );
}
