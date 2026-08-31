import Image from "next/image";

type Variant =
  | "magenta"
  | "white"
  | "black"
  | "iso-silver"
  | "iso-white"
  | "iso-black"
  | "iso-magenta";

const MAP: Record<Variant, { src: string; w: number; h: number }> = {
  magenta: { src: "/brand/alere-lockup-magenta.png", w: 2037, h: 577 },
  white: { src: "/brand/alere-lockup-white.png", w: 2041, h: 578 },
  black: { src: "/brand/alere-lockup-black.png", w: 2037, h: 577 },
  "iso-silver": { src: "/brand/alere-iso-silver.png", w: 1127, h: 971 },
  "iso-white": { src: "/brand/alere-iso-white.png", w: 1127, h: 972 },
  "iso-black": { src: "/brand/alere-iso-black.png", w: 1127, h: 971 },
  "iso-magenta": { src: "/brand/alere-iso-on-magenta.png", w: 1772, h: 1772 },
};

/**
 * Logo de marca. `variant` elige el archivo correcto según el fondo.
 * El tamaño se controla con `className` (p.ej. `h-10 w-auto`).
 */
export function Logo({
  variant = "magenta",
  className = "h-10 w-auto",
  priority = false,
  alt = "Alere's — Laboratorio y Suministros",
}: {
  variant?: Variant;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  const { src, w, h } = MAP[variant];
  return (
    <Image
      src={src}
      width={w}
      height={h}
      alt={alt}
      priority={priority}
      className={className}
      sizes="(max-width: 768px) 60vw, 300px"
    />
  );
}
