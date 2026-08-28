import { site } from "./site";

/** Formatea un precio con la moneda configurada en site.ts. */
export function formatPrecio(precio: number | null): string {
  if (precio === null || Number.isNaN(precio)) return "Consultar";
  try {
    return new Intl.NumberFormat(site.currency.locale, {
      style: "currency",
      currency: site.currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(precio);
  } catch {
    return `${site.currency.symbol}${precio.toFixed(2)}`;
  }
}

/** Convierte un valor que puede venir como string/number a número seguro. */
export function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(",", "."));
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

/** Genera un slug ASCII a partir de un texto (para categorías, etc.). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
