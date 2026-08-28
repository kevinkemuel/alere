import Image from "next/image";
import { Boxes, Tag, GraduationCap, Handshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const POINTS = [
  {
    icon: Boxes,
    title: "Catálogo en tiempo real",
    desc: "Precios y existencias sincronizados con el inventario. Lo que ves es lo que hay.",
  },
  {
    icon: Tag,
    title: "Precios transparentes",
    desc: "Sin sorpresas. Consulta el precio de cada producto y cotiza sólo lo que necesitas.",
  },
  {
    icon: GraduationCap,
    title: "Asesoría especializada",
    desc: "Te orientamos en la selección de reactivos, equipos e insumos según tu laboratorio.",
  },
  {
    icon: Handshake,
    title: "Respaldo y garantía",
    desc: "Marcas reconocidas y respuesta por cada suministro que entregamos.",
  },
];

export function ValueProps() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Panel oscuro */}
          <Reveal className="relative flex min-h-[22rem] flex-col justify-center overflow-hidden rounded-3xl bg-brand-gradient p-10 text-white">
            <div aria-hidden className="dot-grid-dark absolute inset-0 opacity-30" />
            {/* Marca de agua del isotipo */}
            <Image
              src="/brand/alere-iso-white.png"
              width={1127}
              height={972}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-14 -right-10 w-72 rotate-[-10deg] opacity-[0.12]"
            />
            <div className="relative">
              <span className="label text-white/70">Nuestro compromiso</span>
              <h2 className="font-display mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.05] tracking-tight">
                Un aliado serio para tu laboratorio.
              </h2>
              <p className="mt-4 max-w-md text-white/80">
                Disponibilidad real, precios claros y asesoría cercana para que
                nunca te falte lo esencial.
              </p>
            </div>
          </Reveal>

          {/* Puntos */}
          <Stagger className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {POINTS.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="flex h-full flex-col bg-white p-7">
                  <Icon className="h-7 w-7 text-magenta-500" strokeWidth={1.5} />
                  <h3 className="font-display mt-5 text-lg font-semibold text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-support">
                    {desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
