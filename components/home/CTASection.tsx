import Link from "next/link";
import { Search, ClipboardList, MessageCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ChevronMark } from "@/components/ui/Chevron";

const STEPS = [
  {
    icon: Search,
    n: "01",
    title: "Explora el catálogo",
    desc: "Filtra por categoría y consulta precio y disponibilidad en vivo.",
  },
  {
    icon: ClipboardList,
    n: "02",
    title: "Arma tu cotización",
    desc: "Agrega los productos que necesitas y ajusta cantidades.",
  },
  {
    icon: MessageCircle,
    n: "03",
    title: "Recibe por WhatsApp",
    desc: "Envías tu lista en un clic y te respondemos al momento.",
  },
];

export function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow="Cómo funciona"
            title="De la búsqueda a la cotización, en minutos"
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, n, title, desc }, i) => (
            <StaggerItem key={n}>
              <div className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-white text-magenta-500">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <span className="index-num text-4xl font-semibold text-magenta-100">
                    {n}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-xl font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-2 max-w-xs text-support">{desc}</p>
                {i < STEPS.length - 1 && (
                  <ChevronMark className="absolute -right-2 top-4 hidden h-5 w-5 rotate-90 text-magenta-300 md:block" />
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-14">
          <Link
            href="/catalogo"
            className="group inline-flex items-center gap-2 rounded-full bg-magenta-500 px-7 py-4 font-semibold text-white shadow-[var(--shadow-brand)] transition-colors hover:bg-magenta-600"
          >
            Explorar catálogo
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
