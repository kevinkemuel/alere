import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ChevronMark } from "@/components/ui/Chevron";
import { CotizarClient } from "./CotizarClient";

export const metadata: Metadata = {
  title: "Cotizar / Contacto",
  description:
    "Solicita tu cotización de suministros de laboratorio. Arma tu lista de productos y envíala por WhatsApp, o contáctanos directamente.",
};

export default function CotizarPage() {
  return (
    <>
      <section className="border-b border-line bg-paper-2 pb-12 pt-30 sm:pb-14">
        <Container>
          <p className="label flex items-center gap-2 text-magenta-500">
            <ChevronMark className="h-3.5 w-3.5" /> Cotizar / Contacto
          </p>
          <h1 className="font-display mt-4 text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tight text-ink">
            Solicita tu cotización
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-support">
            Cuéntanos qué necesita tu laboratorio. Agrega productos desde el
            catálogo o describe tu pedido; te respondemos con precios y
            disponibilidad al momento.
          </p>
        </Container>
      </section>
      <CotizarClient />
    </>
  );
}
