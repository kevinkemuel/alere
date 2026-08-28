import { Truck, BadgeCheck, Headset, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const ITEMS = [
  { icon: Truck, title: "Entrega 24-48h", desc: "Despacho ágil a nivel nacional" },
  { icon: BadgeCheck, title: "Marcas reconocidas", desc: "Proveedores certificados" },
  { icon: Headset, title: "Asesoría técnica", desc: "Te ayudamos a elegir" },
  { icon: ShieldCheck, title: "Calidad garantizada", desc: "Insumos con respaldo" },
];

export function TrustBar() {
  return (
    <Container className="py-14 sm:py-16">
      <Reveal>
        <Stagger className="grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title}>
              <div className="flex items-start gap-4 px-2 py-6 lg:px-7">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-magenta-500" strokeWidth={1.6} />
                <div>
                  <p className="font-medium text-ink">{title}</p>
                  <p className="mt-0.5 text-sm text-support">{desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>
    </Container>
  );
}
