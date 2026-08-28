import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ChevronMark } from "@/components/ui/Chevron";
import { catalog, usingMock } from "@/lib/catalog";
import { CatalogoClient } from "./CatalogoClient";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Catálogo de suministros para laboratorio clínico con precios y disponibilidad en tiempo real: reactivos, consumibles, cristalería, equipos y bioseguridad.",
};

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: PageProps<"/catalogo">) {
  const params = await searchParams;
  const marcaParam = typeof params.marca === "string" ? params.marca : "";

  const [meta, marcas, productos] = await Promise.all([
    catalog.getMeta(),
    catalog.getMarcas(),
    catalog.getProductos(),
  ]);

  return (
    <>
      <section className="border-b border-line bg-paper-2 pb-12 pt-30 sm:pb-14">
        <Container>
          <p className="label flex items-center gap-2 text-magenta-500">
            <ChevronMark className="h-3.5 w-3.5" /> Catálogo
          </p>
          <h1 className="font-display mt-4 text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tight text-ink">
            Suministros de laboratorio
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-support">
            Explora nuestras líneas con precio y disponibilidad actualizados.
            Agrega lo que necesites a tu cotización y envíala por WhatsApp en un
            clic.
          </p>
        </Container>
      </section>

      <Container className="py-8">
        <CatalogoClient
          productos={productos}
          marcas={marcas}
          initialMarca={marcaParam}
          mostrarStock={meta.mostrarStock}
          usingMock={usingMock}
        />
      </Container>
    </>
  );
}
