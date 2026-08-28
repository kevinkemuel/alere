import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export function Brands({ marcas }: { marcas: string[] }) {
  if (marcas.length === 0) return null;
  const top = marcas.slice(0, 28);
  const hayMas = marcas.length > top.length;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              index="01"
              eyebrow="Marcas"
              title="Marcas que manejamos"
              description="Trabajamos con fabricantes reconocidos de reactivos, insumos y equipos de laboratorio."
            />
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-magenta-600"
            >
              Ver catálogo completo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <Stagger gap={0.03} className="mt-12 flex flex-wrap gap-3">
          {top.map((m) => (
            <StaggerItem key={m}>
              <Link
                href={`/catalogo?marca=${encodeURIComponent(m)}`}
                className="inline-flex items-center rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/80 transition-all hover:-translate-y-0.5 hover:border-magenta-300 hover:text-magenta-600"
              >
                {m}
              </Link>
            </StaggerItem>
          ))}
          {hayMas && (
            <StaggerItem>
              <Link
                href="/catalogo"
                className="inline-flex items-center rounded-full bg-magenta-50 px-5 py-2.5 text-sm font-semibold text-magenta-600 transition hover:bg-magenta-100"
              >
                +{marcas.length - top.length} más
              </Link>
            </StaggerItem>
          )}
        </Stagger>
      </Container>
    </section>
  );
}
