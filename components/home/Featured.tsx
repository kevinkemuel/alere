import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { Producto } from "@/lib/catalog/types";

export function Featured({
  productos,
  mostrarStock = true,
}: {
  productos: Producto[];
  mostrarStock?: boolean;
}) {
  if (productos.length === 0) return null;
  return (
    <section className="border-y border-line bg-paper-2 py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              index="02"
              eyebrow="Destacados"
              title="Productos frecuentes"
            />
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-magenta-600"
            >
              Ver todo el catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard producto={p} mostrarStock={mostrarStock} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
