import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Zap, Award, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronMark, SectionEdge } from "@/components/ui/Chevron";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce a Aalere's, tu aliado en suministros para laboratorios clínicos: reactivos, consumibles, equipos y bioseguridad con respaldo y asesoría.",
};

const VALORES = [
  { icon: ShieldCheck, title: "Confiabilidad", desc: "Cumplimos lo prometido: disponibilidad real y entregas a tiempo." },
  { icon: Award, title: "Calidad", desc: "Marcas reconocidas y productos con respaldo técnico." },
  { icon: HeartHandshake, title: "Cercanía", desc: "Atención personalizada y asesoría honesta para cada laboratorio." },
  { icon: Zap, title: "Agilidad", desc: "Procesos simples: cotiza, confirma y recibe sin complicaciones." },
];

const STATS = [
  { to: 500, suffix: "+", label: "Referencias disponibles" },
  { to: 48, suffix: "h", label: "Entrega típica" },
  { to: 8, suffix: "", label: "Líneas de producto" },
  { to: 100, suffix: "%", label: "Insumos con respaldo" },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-gradient text-white">
        <div aria-hidden className="dot-grid-dark absolute inset-0 opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-[8%] h-[38rem] w-[38rem] rounded-full bg-magenta-600/30 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 left-[-10%] h-[30rem] w-[30rem] rounded-full bg-magenta-glow/10 blur-[120px]"
        />
        <Container className="relative grid items-center gap-10 pb-20 pt-32 md:grid-cols-[1.2fr_0.8fr] md:pb-28 md:pt-40">
          <div>
            <p className="label flex items-center gap-2 text-magenta-glow">
              <ChevronMark className="h-3.5 w-3.5" /> Nosotros
            </p>
            <h1 className="font-display mt-6 text-[clamp(2.4rem,5.5vw,4.25rem)] font-semibold leading-[1.0] tracking-tight">
              Tu proveedor de confianza en insumos de laboratorio
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              En Aalere&apos;s abastecemos a laboratorios clínicos con reactivos,
              consumibles, cristalería, equipos y bioseguridad. Combinamos
              disponibilidad, precios claros y asesoría cercana para que tu
              operación nunca se detenga.
            </p>
          </div>
          <div className="relative mx-auto hidden w-64 md:block">
            <Image
              src="/brand/alere-iso-silver.png"
              width={1127}
              height={971}
              alt=""
              className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            />
          </div>
        </Container>
        <SectionEdge position="bottom" colorClass="text-paper" />
      </section>

      {/* Quiénes somos */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              index="01"
              eyebrow="Quiénes somos"
              title="Especialistas en suministros para laboratorio clínico"
            />
            <div className="mt-6 space-y-4 text-support">
              <p>
                Nacimos para resolver un problema cotidiano: conseguir insumos de
                calidad, al precio correcto y en el momento justo. Por eso
                construimos un catálogo con disponibilidad y precios actualizados,
                y un proceso de cotización rápido y transparente.
              </p>
              <p>
                Atendemos desde laboratorios pequeños hasta centros de alto
                volumen, con la misma prioridad: que tengas lo que necesitas para
                seguir trabajando.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-magenta-500 px-7 py-4 font-semibold text-white shadow-[var(--shadow-brand)] transition-colors hover:bg-magenta-600"
            >
              Ver catálogo
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {STATS.map((s) => (
              <StaggerItem key={s.label}>
                <div className="flex h-full flex-col justify-center bg-white p-7">
                  <p className="font-display text-4xl font-semibold tracking-tight text-magenta-600 sm:text-5xl">
                    <Counter to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-support">{s.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Valores */}
      <section className="border-y border-line bg-paper-2 py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              index="02"
              eyebrow="Nuestros valores"
              title="Cómo trabajamos"
              description="Principios que guían cada cotización, cada entrega y cada relación."
            />
          </Reveal>
          <Stagger className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {VALORES.map(({ icon: Icon, title, desc }) => (
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
        </Container>
      </section>

      <CTASection />
    </>
  );
}
