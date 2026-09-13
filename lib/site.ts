/**
 * Configuración central del sitio Alere's.
 * ─────────────────────────────────────────────────────────────
 * Todos los datos de contacto y de negocio viven aquí para que
 * reemplazar los PLACEHOLDERS sea un cambio de un solo archivo.
 */

export const site = {
  name: "Alere's",
  legalName: "Alere's — Laboratorio y Suministros",
  tagline: "Laboratorio y Suministros",
  description:
    "Suministros para laboratorios clínicos: reactivos, consumibles, cristalería, equipos y bioseguridad. Catálogo con precios y disponibilidad en tiempo real.",
  url: "https://alere-suministros.vercel.app", // provisional (Vercel); cambiar por dominio propio

  // Identificador del catálogo compartido de Komercio para Alere's: el slug
  // personalizado ("alere") o el token aleatorio. Es público (va en la URL:
  // /catalogo/alere). La consulta acepta cualquiera de los dos.
  catalogoId: process.env.NEXT_PUBLIC_CATALOGO_ID ?? "alere",

  // ── Contacto (PLACEHOLDERS — reemplazar) ──────────────────
  contact: {
    // WhatsApp en formato internacional SIN "+", espacios ni guiones.
    // Ej. Venezuela: 58 + 412 + 1234567 => "584121234567"
    whatsapp: "584142682825",
    whatsappLabel: "+58 414-268-2825",
    email: "ventas@aleres-lab.com",
    phone: "+58 414-268-2825",
    address: "Caracas, Venezuela",
    coverage: "Cobertura nacional",
    hours: "Lun a Vie, 8:00 a.m. – 5:00 p.m.",
  },

  social: {
    instagram: "", // sin Instagram por ahora (el ícono se oculta si está vacío)
    facebook: "",
  },

  // ── Moneda para mostrar precios ───────────────────────────
  currency: {
    code: "USD",
    symbol: "$",
    locale: "es-VE",
  },
} as const;

/** Construye una URL de WhatsApp (wa.me) con mensaje prellenado. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Mensaje por defecto para el botón flotante y CTAs genéricos. */
export const defaultWhatsappMessage = `Hola ${site.name}, me gustaría solicitar información sobre sus suministros de laboratorio.`;
