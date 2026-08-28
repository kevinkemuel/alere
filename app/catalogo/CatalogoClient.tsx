"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, X, ClipboardList, ArrowRight, ChevronDown } from "lucide-react";
import type { Producto } from "@/lib/catalog/types";
import { useQuote } from "@/lib/quote/QuoteContext";
import { ProductCard } from "@/components/catalog/ProductCard";

const PAGE = 24;

export function CatalogoClient({
  productos,
  marcas,
  initialMarca = "",
  mostrarStock = true,
  usingMock = false,
}: {
  productos: Producto[];
  marcas: string[];
  initialMarca?: string;
  mostrarStock?: boolean;
  usingMock?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [marca, setMarca] = useState(initialMarca);
  const [visible, setVisible] = useState(PAGE);
  const { count } = useQuote();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return productos
      .filter((p) => (marca ? p.marca === marca : true))
      .filter((p) =>
        q
          ? p.nombre.toLowerCase().includes(q) ||
            (p.marca ?? "").toLowerCase().includes(q) ||
            (p.sku ?? "").toLowerCase().includes(q)
          : true
      );
  }, [productos, marca, search]);

  // Reinicia la paginación al cambiar filtros
  useEffect(() => setVisible(PAGE), [search, marca]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="pb-28">
      {/* Controles */}
      <div className="sticky top-18 z-30 -mx-5 border-b border-line bg-paper/85 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-support" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, marca o código…"
              className="w-full rounded-full border border-line bg-white py-3 pl-12 pr-4 text-ink outline-none transition focus:border-magenta-400 focus:ring-4 focus:ring-magenta-100"
              aria-label="Buscar productos"
            />
          </div>
          <div className="relative sm:w-64">
            <select
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              aria-label="Filtrar por marca"
              className="w-full appearance-none rounded-full border border-line bg-white py-3 pl-5 pr-11 text-ink outline-none transition focus:border-magenta-400 focus:ring-4 focus:ring-magenta-100"
            >
              <option value="">Todas las marcas</option>
              {marcas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-support" />
          </div>
        </div>
      </div>

      {usingMock && (
        <div className="mx-auto mt-6 max-w-7xl">
          <p className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong>Vista previa:</strong> mostrando datos de muestra. Con el
            catálogo real conectado, aquí aparecen los productos de Aalere&apos;s
            con precios actualizados.
          </p>
        </div>
      )}

      <div className="mx-auto mt-6 max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <p className="label text-support">
            <span className="index-num text-ink">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "producto" : "productos"}
            {marca && <> · {marca}</>}
          </p>
          {(search || marca) && (
            <button
              onClick={() => {
                setSearch("");
                setMarca("");
              }}
              className="inline-flex items-center gap-1 text-sm font-medium text-magenta-600 hover:text-magenta-700"
            >
              <X className="h-4 w-4" /> Limpiar
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper-2 py-20 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              Sin resultados
            </p>
            <p className="mt-1 text-support">
              Prueba con otro término o marca, o escríbenos para consultar
              disponibilidad.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((p) => (
                <ProductCard key={p.id} producto={p} mostrarStock={mostrarStock} />
              ))}
            </div>

            {visible < filtered.length && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="label text-support">
                  Mostrando {shown.length} de {filtered.length}
                </p>
                <button
                  onClick={() => setVisible((v) => v + PAGE)}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-white"
                >
                  Cargar más productos
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Barra flotante de cotización */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-5 py-3 shadow-[var(--shadow-float)] backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-magenta-50 text-magenta-600">
                <ClipboardList className="h-5 w-5" />
              </span>
              <p className="text-sm text-ink">
                <span className="index-num font-bold">{count}</span>{" "}
                {count === 1 ? "producto" : "productos"} en tu cotización
              </p>
            </div>
            <Link
              href="/cotizar"
              className="group inline-flex items-center gap-2 rounded-full bg-magenta-500 px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition hover:bg-magenta-600"
            >
              Revisar y enviar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
