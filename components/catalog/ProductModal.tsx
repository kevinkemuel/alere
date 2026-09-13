"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import type { Producto } from "@/lib/catalog/types";
import { formatPrecio } from "@/lib/format";
import { useQuote } from "@/lib/quote/QuoteContext";
import { StockBadge } from "./StockBadge";

/**
 * Modal de detalle de producto con galería (foto principal + `imagenesExtra`
 * de Komercio). Se monta solo cuando está abierto; `onClose` lo desmonta.
 */
export function ProductModal({
  producto,
  mostrarStock = true,
  onClose,
}: {
  producto: Producto;
  mostrarStock?: boolean;
  onClose: () => void;
}) {
  const { has, toggle } = useQuote();
  const selected = has(producto.id);
  const agotado = producto.disponibilidad === "agotado";
  const imgs = producto.imagenes;
  const varias = imgs.length > 1;

  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  const activa = imgs[idx] ?? null;

  // Solo portamos tras montar en cliente (document.body garantizado).
  useEffect(() => setMounted(true), []);

  // Cierre con animación de salida.
  const close = useCallback(() => {
    setShow(false);
    setTimeout(onClose, 180);
  }, [onClose]);

  // Entrada + bloqueo de scroll + teclado (Esc / flechas).
  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() => setShow(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (imgs.length > 1) {
        if (e.key === "ArrowRight") setIdx((i) => (i + 1) % imgs.length);
        if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + imgs.length) % imgs.length);
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [mounted, close, imgs.length]);

  const prev = () => setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIdx((i) => (i + 1) % imgs.length);

  // Portal a <body>: evita que el `transform`/`overflow-hidden` de la tarjeta
  // (contenedora) rompan el posicionamiento fijo del modal.
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <button
        aria-label="Cerrar"
        onClick={close}
        className={`absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-200 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={producto.nombre}
        className={`relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-3xl border border-line bg-paper shadow-[var(--shadow-float)] transition-all duration-200 md:flex-row md:overflow-hidden ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Cerrar */}
        <button
          onClick={close}
          aria-label="Cerrar detalle"
          className="absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm ring-1 ring-line backdrop-blur transition hover:bg-white hover:text-magenta-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Galería */}
        <div className="flex shrink-0 flex-col gap-3 bg-paper-2 p-4 sm:p-5 md:w-1/2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-white md:aspect-square">
            {activa ? (
              <Image
                key={activa}
                src={activa}
                alt={producto.nombre}
                fill
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-contain"
              />
            ) : (
              <div className="bg-ink-gradient relative flex h-full w-full items-center justify-center">
                <div className="dot-grid-dark absolute inset-0 opacity-40" />
                <Image
                  src="/brand/alere-iso-silver.png"
                  width={1127}
                  height={971}
                  alt=""
                  className="relative h-24 w-auto opacity-90 drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
                />
              </div>
            )}

            {mostrarStock && (
              <div className="absolute left-3 top-3">
                <StockBadge
                  estado={producto.disponibilidad}
                  inventario={producto.inventario}
                  showQty
                />
              </div>
            )}

            {varias && (
              <>
                <button
                  onClick={prev}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm ring-1 ring-line transition hover:bg-white hover:text-magenta-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  aria-label="Foto siguiente"
                  className="absolute right-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm ring-1 ring-line transition hover:bg-white hover:text-magenta-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="label absolute bottom-3 right-3 rounded bg-black/45 px-2 py-0.5 text-[0.6rem] text-white/90 backdrop-blur-sm">
                  {idx + 1} / {imgs.length}
                </span>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {varias && (
            <div className="flex flex-wrap gap-2">
              {imgs.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setIdx(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={i === idx}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white transition ${
                    i === idx
                      ? "border-magenta-500 ring-2 ring-magenta-200"
                      : "border-line hover:border-magenta-300"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-6 sm:p-8 md:w-1/2 md:overflow-y-auto">
          {producto.categorias[0] && (
            <span className="label text-magenta-500">
              {producto.categorias[0]}
            </span>
          )}
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-ink">
            {producto.nombre}
          </h2>
          {producto.marca && (
            <p className="mt-1 text-support">{producto.marca}</p>
          )}

          {producto.descripcion && (
            <p className="mt-4 text-sm leading-relaxed text-support">
              {producto.descripcion}
            </p>
          )}

          {producto.categorias.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {producto.categorias.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-magenta-50 px-3 py-1 text-xs font-medium text-magenta-600"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-6">
            <p className="label text-support/70">Precio</p>
            <p className="font-display text-3xl font-semibold tracking-tight text-ink">
              {formatPrecio(producto.precio)}
            </p>

            <button
              onClick={() =>
                toggle({
                  id: producto.id,
                  nombre: producto.nombre,
                  sku: producto.sku,
                  marca: producto.marca,
                  precio: producto.precio,
                })
              }
              aria-pressed={selected}
              className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-6 py-3.5 text-sm font-semibold transition-all ${
                selected
                  ? "bg-magenta-500 text-white"
                  : "border border-ink/15 text-ink hover:border-magenta-500 hover:bg-magenta-500 hover:text-white"
              }`}
            >
              {selected ? (
                <>
                  <Check className="h-4 w-4" /> Agregado a la cotización
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Agregar a la cotización
                </>
              )}
            </button>

            {mostrarStock && agotado && (
              <p className="mt-3 border-t border-line pt-3 text-xs text-support">
                Sin stock — cotízalo y te avisamos cuando llegue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
