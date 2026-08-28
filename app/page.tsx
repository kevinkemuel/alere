import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { Brands } from "@/components/home/Brands";
import { ValueProps } from "@/components/home/ValueProps";
import { Featured } from "@/components/home/Featured";
import { CTASection } from "@/components/home/CTASection";
import { catalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [meta, marcas, productos] = await Promise.all([
    catalog.getMeta(),
    catalog.getMarcas(),
    catalog.getProductos(),
  ]);

  // Destacados: prioriza los que tienen imagen (se ven mejor), toma 4.
  const destacados = [...productos]
    .sort((a, b) => Number(!!b.imagen) - Number(!!a.imagen))
    .slice(0, 4);

  return (
    <>
      <Hero />
      <TrustBar />
      <Brands marcas={marcas} />
      <ValueProps />
      <Featured productos={destacados} mostrarStock={meta.mostrarStock} />
      <CTASection />
    </>
  );
}
