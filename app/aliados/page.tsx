import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronMark } from "@/components/ui/Chevron";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Aliados y marcas",
  description:
    "Marcas y fabricantes con los que trabaja Alere's para ofrecer suministros de laboratorio con respaldo y calidad.",
};

export const dynamic = "force-dynamic";

const BENEFITS = [
  { t: "Calidad certificada", d: "Productos de fabricantes con estándares reconocidos." },
  { t: "Trazabilidad", d: "Insumos con respaldo para tu control de calidad." },
  { t: "Continuidad", d: "Abastecimiento estable para que no te quedes sin stock." },
];

export default async function AliadosPage() {
  const marcas = await catalog.getMarcas();

  return (
    <>
      <section className="border-b border-line bg-paper-2 pb-12 pt-30 sm:pb-14">
        <Container>
          <p className="label flex items-center gap-2 text-magenta-500">
            <ChevronMark className="h-3.5 w-3.5" /> Aliados y marcas
          </p>
          <h1 className="font-display mt-4 text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tight text-ink">
            Respaldados por marcas de confianza
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-support">
            Manejamos {marcas.length}+ marcas y fabricantes reconocidos para
            garantizar la calidad de cada insumo que llega a tu laboratorio.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <Stagger gap={0.025} className="flex flex-wrap gap-3">
            {marcas.map((m) => (
              <StaggerItem key={m}>
                <Link
                  href={`/catalogo?marca=${encodeURIComponent(m)}`}
                  className="inline-flex items-center rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/80 transition-all hover:-translate-y-0.5 hover:border-magenta-300 hover:text-magenta-600"
                >
                  {m}
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-y border-line bg-paper-2 py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              index="02"
              eyebrow="Por qué importa"
              title="Marcas con respaldo, resultados confiables"
              description="Elegir buenos aliados es parte de nuestra propuesta de valor."
            />
          </Reveal>
          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <StaggerItem key={b.t}>
                <div className="flex h-full flex-col bg-white p-7">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {b.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-support">{b.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="mt-14 text-center">
            <Link
              href="/cotizar"
              className="group inline-flex items-center gap-2 rounded-full bg-magenta-500 px-7 py-4 font-semibold text-white shadow-[var(--shadow-brand)] transition-colors hover:bg-magenta-600"
            >
              Solicita tu cotización
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
