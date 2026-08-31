"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Trash2,
  Minus,
  Plus,
  Send,
  ClipboardList,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useQuote } from "@/lib/quote/QuoteContext";
import { formatPrecio } from "@/lib/format";
import { site, whatsappUrl } from "@/lib/site";

export function CotizarClient() {
  const { items, count, setCantidad, remove, clear } = useQuote();
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function buildMessage() {
    const L: string[] = [];
    L.push("*Solicitud de cotización — Alere's*", "");
    L.push(`*Cliente:* ${form.nombre}`);
    if (form.empresa) L.push(`*Laboratorio/Empresa:* ${form.empresa}`);
    if (form.email) L.push(`*Correo:* ${form.email}`);
    if (form.telefono) L.push(`*Teléfono:* ${form.telefono}`);
    L.push("");
    if (items.length > 0) {
      L.push("*Productos de interés:*");
      items.forEach((it, i) => {
        const code = it.sku ? ` (${it.sku})` : "";
        L.push(`${i + 1}. ${it.nombre}${code} — Cantidad: ${it.cantidad}`);
      });
      L.push("");
    }
    if (form.mensaje) L.push(`*Mensaje:* ${form.mensaje}`);
    return L.join("\n");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError("Por favor indícanos tu nombre.");
      return;
    }
    if (items.length === 0 && !form.mensaje.trim()) {
      setError("Agrega productos desde el catálogo o escríbenos un mensaje.");
      return;
    }
    setError(null);
    window.open(whatsappUrl(buildMessage()), "_blank", "noopener,noreferrer");
  }

  return (
    <Container className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
      {/* Formulario + productos */}
      <div className="min-w-0">
        <form
          onSubmit={submit}
          className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8"
        >
          <h2 className="font-display text-xl font-semibold text-ink">Tus datos</h2>
          <p className="mt-1 text-sm text-support">
            Completa el formulario y te enviaremos la cotización por WhatsApp.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre y apellido *">
              <input
                value={form.nombre}
                onChange={set("nombre")}
                required
                className={inputCls}
                placeholder="Ej. María Pérez"
              />
            </Field>
            <Field label="Laboratorio / Empresa">
              <input
                value={form.empresa}
                onChange={set("empresa")}
                className={inputCls}
                placeholder="Ej. Laboratorio Clínico San Rafael"
              />
            </Field>
            <Field label="Correo electrónico">
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                className={inputCls}
                placeholder="tucorreo@ejemplo.com"
              />
            </Field>
            <Field label="Teléfono">
              <input
                type="tel"
                value={form.telefono}
                onChange={set("telefono")}
                className={inputCls}
                placeholder="+58 …"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Mensaje (opcional)">
              <textarea
                value={form.mensaje}
                onChange={set("mensaje")}
                rows={4}
                className={`${inputCls} resize-none`}
                placeholder="Cuéntanos qué necesitas, cantidades, condiciones de entrega…"
              />
            </Field>
          </div>

          {/* Productos seleccionados */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-ink">
                <ClipboardList className="h-5 w-5 text-magenta-600" />
                Productos en tu cotización
                <span className="rounded-full bg-magenta-50 px-2 py-0.5 text-xs font-bold text-magenta-600">
                  {count}
                </span>
              </h3>
              {count > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-sm font-medium text-support hover:text-magenta-600"
                >
                  Vaciar
                </button>
              )}
            </div>

            {count === 0 ? (
              <p className="mt-3 rounded-2xl border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-sm text-support">
                Aún no has agregado productos. Puedes seleccionarlos desde el{" "}
                <a href="/catalogo" className="font-semibold text-magenta-600">
                  catálogo
                </a>{" "}
                o describir tu pedido en el mensaje.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {it.nombre}
                      </p>
                      <p className="text-xs text-support">
                        {[it.marca, it.sku].filter(Boolean).join(" · ")}
                        {it.precio !== null && ` · ${formatPrecio(it.precio)}`}
                      </p>
                    </div>
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        aria-label="Disminuir"
                        onClick={() => setCantidad(it.id, it.cantidad - 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink hover:text-magenta-600"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {it.cantidad}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar"
                        onClick={() => setCantidad(it.id, it.cantidad + 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink hover:text-magenta-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label="Quitar"
                      onClick={() => remove(it.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-support hover:bg-magenta-50 hover:text-magenta-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.5)] transition hover:bg-[#20bd5a] sm:w-auto"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Enviar cotización por WhatsApp
          </button>
          <p className="mt-3 text-xs text-support">
            Se abrirá WhatsApp con tu solicitud lista para enviar. No se comparte
            ningún dato hasta que tú presiones enviar.
          </p>
        </form>
      </div>

      {/* Info de contacto */}
      <aside className="min-w-0 lg:pt-2">
        <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-8 text-white shadow-[var(--shadow-brand)]">
          <div aria-hidden className="dot-grid-dark absolute inset-0 opacity-30" />
          <h2 className="font-display relative text-xl font-semibold">
            Contáctanos directamente
          </h2>
          <p className="relative mt-2 text-sm text-white/85">
            ¿Prefieres hablar con nosotros? Estos son nuestros canales.
          </p>
          <ul className="relative mt-6 space-y-4 text-sm">
            <ContactRow
              icon={<WhatsAppIcon className="h-5 w-5" />}
              href={whatsappUrl()}
              external
            >
              {site.contact.whatsappLabel}
            </ContactRow>
            <ContactRow
              icon={<Mail className="h-5 w-5" />}
              href={`mailto:${site.contact.email}`}
            >
              {site.contact.email}
            </ContactRow>
            <ContactRow icon={<Phone className="h-5 w-5" />}>
              {site.contact.phone}
            </ContactRow>
            <ContactRow icon={<MapPin className="h-5 w-5" />}>
              {site.contact.address} — {site.contact.coverage}
            </ContactRow>
            <ContactRow icon={<Clock className="h-5 w-5" />}>
              {site.contact.hours}
            </ContactRow>
          </ul>
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-magenta-50 text-magenta-600">
              <Send className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-ink">Respuesta rápida</p>
              <p className="text-sm text-support">
                Cotizamos en horario laboral, normalmente el mismo día.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </Container>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition placeholder:text-support/60 focus:border-magenta-400 focus:ring-4 focus:ring-magenta-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function ContactRow({
  icon,
  href,
  external,
  children,
}: {
  icon: React.ReactNode;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
        {icon}
      </span>
      <span className="text-white/90">{children}</span>
    </>
  );
  if (href) {
    return (
      <li>
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="flex items-center gap-3 transition-colors hover:text-white"
        >
          {inner}
        </a>
      </li>
    );
  }
  return <li className="flex items-center gap-3">{inner}</li>;
}
