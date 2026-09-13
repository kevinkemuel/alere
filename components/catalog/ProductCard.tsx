"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Eye, Images, Plus } from "lucide-react";
import type { Producto } from "@/lib/catalog/types";
import { formatPrecio } from "@/lib/format";
import { useQuote } from "@/lib/quote/QuoteContext";
import { StockBadge } from "./StockBadge";
import { ProductModal } from "./ProductModal";

export function ProductCard({
  producto,
  mostrarStock = true,
}: {
  producto: Producto;
  mostrarStock?: boolean;
}) {
  const { has, toggle } = useQuote();
  const selected = has(producto.id);
  const agotado = producto.disponibilidad === "agotado";
  const [open, setOpen] = useState(false);
  const nFotos = producto.imagenes.length;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-soft)] ${
        selected ? "border-magenta-400" : "border-line hover:border-magenta-200"
      }`}
    >
      {/* Imagen / placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="bg-ink-gradient relative flex h-full w-full items-center justify-center">
            <div className="dot-grid-dark absolute inset-0 opacity-40" />
            {/* Glow magenta — mismo tono cálido del hero */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-magenta-600/45 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-magenta-glow/15 blur-2xl"
            />
            <Image
              src="/brand/alere-iso-silver.png"
              width={1127}
              height={971}
              alt=""
              className="relative h-16 w-auto opacity-90 drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
        {/* Overlay clickeable → abre el detalle */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Ver detalles de ${producto.nombre}`}
          className="absolute inset-0 z-10 flex items-end justify-center bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-ink shadow-sm">
            <Eye className="h-4 w-4" /> Ver detalles
          </span>
        </button>

        {mostrarStock && (
          <div className="absolute left-3 top-3 z-20">
            <StockBadge
              estado={producto.disponibilidad}
              inventario={producto.inventario}
              showQty
            />
          </div>
        )}
        {nFotos > 1 && (
          <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[0.65rem] font-semibold text-white/90 backdrop-blur-sm">
            <Images className="h-3 w-3" /> {nFotos}
          </span>
        )}
        {producto.sku && (
          <span className="label absolute bottom-3 right-3 z-20 rounded bg-black/35 px-2 py-0.5 text-[0.6rem] text-white/85 backdrop-blur-sm">
            {producto.sku}
          </span>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-5">
        {producto.categorias[0] && (
          <span className="label text-magenta-500">{producto.categorias[0]}</span>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 text-left"
        >
          <h3 className="line-clamp-2 font-medium leading-snug text-ink transition-colors hover:text-magenta-600">
            {producto.nombre}
          </h3>
        </button>
        {producto.marca && (
          <p className="mt-1 text-sm text-support">{producto.marca}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="label text-support/70">Precio</p>
            <p className="font-display text-2xl font-semibold tracking-tight text-ink">
              {formatPrecio(producto.precio)}
            </p>
          </div>
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
            aria-label={selected ? "Quitar de la cotización" : "Agregar a la cotización"}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              selected
                ? "bg-magenta-500 text-white"
                : "border border-ink/15 text-ink hover:border-magenta-500 hover:bg-magenta-500 hover:text-white"
            }`}
          >
            {selected ? (
              <>
                <Check className="h-4 w-4" /> Agregado
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Cotizar
              </>
            )}
          </button>
        </div>
        {mostrarStock && agotado && (
          <p className="mt-3 border-t border-line pt-3 text-xs text-support">
            Sin stock — cotízalo y te avisamos cuando llegue.
          </p>
        )}
      </div>

      {open && (
        <ProductModal
          producto={producto}
          mostrarStock={mostrarStock}
          onClose={() => setOpen(false)}
        />
      )}
    </article>
  );
}
