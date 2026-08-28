import { cache } from "react";
import {
  CatalogMeta,
  CatalogQuery,
  CatalogSource,
  Producto,
  calcDisponibilidad,
} from "./types";
import { mockSource } from "./mock";
import { prisma } from "../prisma";
import { site } from "../site";

/** Registra el fallo de BD una sola vez para no llenar los logs. */
function logDbError(where: string, e: unknown) {
  console.error(
    `[catalog] BD no disponible en ${where} → usando datos de muestra:`,
    e instanceof Error ? e.message : e
  );
}

/**
 * Fuente de datos REAL — Postgres de Komercio (Supabase) vía Prisma.
 * ─────────────────────────────────────────────────────────────
 * SOLO LECTURA. Busca el negocio por `catalogoToken`/`catalogoSlug` y devuelve
 * sus productos con `activo: true`. Precios en USD (`precioVentaUSD`).
 *
 * Los productos de este negocio NO usan categorías; el fabricante viene entre
 * paréntesis al final del nombre (ej. "Ácido Acético (Centerlab)"), así que lo
 * extraemos como `marca` y lo quitamos del título.
 */

/** Extrae el último paréntesis del nombre como marca/fabricante. */
function splitNombreMarca(nombre: string): { nombre: string; marca: string | null } {
  const m = nombre.match(/\(([^()]+)\)\s*$/);
  if (m && m.index !== undefined) {
    const marca = m[1].trim();
    const limpio = nombre.slice(0, m.index).trim();
    return { nombre: limpio || nombre, marca: marca || null };
  }
  return { nombre, marca: null };
}

// Nota: en esta base `codigo` NO es un SKU: guarda la fecha de vencimiento
// ("FV: dd/mm/aaaa") o "SIN FV". Por eso no se muestra como código de producto.

// Carga cacheada por request (dedup entre getMeta/getMarcas/getProductos).
const loadNegocio = cache(async () => {
  const id = site.catalogoId;
  return prisma.negocio.findFirst({
    where: { OR: [{ catalogoToken: id }, { catalogoSlug: id }] },
    select: {
      nombre: true,
      catalogoMostrarStock: true,
      catalogoMostrarBs: true,
      productos: {
        where: { activo: true },
        orderBy: { nombre: "asc" },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          codigo: true,
          imagenUrl: true,
          precioVentaUSD: true,
          stockActual: true,
          stockMinimo: true,
          categorias: { select: { categoria: { select: { nombre: true } } } },
        },
      },
    },
  });
});

const cargarProductos = cache(async (): Promise<Producto[]> => {
  const negocio = await loadNegocio();
  if (!negocio) return [];
  return negocio.productos.map((p) => {
    const { nombre, marca } = splitNombreMarca(p.nombre);
    const inventario = Math.max(0, Math.round(Number(p.stockActual)));
    const bajo = Math.round(Number(p.stockMinimo)) || 5;
    const catsJoin = p.categorias
      .map((c) => c.categoria?.nombre)
      .filter((n): n is string => !!n);
    return {
      id: p.id,
      sku: null, // `codigo` aquí es fecha de vencimiento, no SKU → se omite
      nombre,
      descripcion: p.descripcion ?? null,
      marca,
      precio: p.precioVentaUSD == null ? null : Number(p.precioVentaUSD),
      inventario,
      bajoInventario: bajo,
      imagen: p.imagenUrl ?? null,
      categorias: catsJoin,
      disponibilidad: calcDisponibilidad(inventario, bajo),
    };
  });
});

export const dbSource: CatalogSource = {
  async getMeta(): Promise<CatalogMeta> {
    try {
      const negocio = await loadNegocio();
      if (!negocio) return mockSource.getMeta();
      return {
        nombre: negocio.nombre,
        mostrarStock: negocio.catalogoMostrarStock,
        mostrarBs: negocio.catalogoMostrarBs,
      };
    } catch (e) {
      logDbError("getMeta", e);
      return mockSource.getMeta();
    }
  },

  async getMarcas(): Promise<string[]> {
    try {
      const productos = await cargarProductos();
      const count = new Map<string, number>();
      for (const p of productos) {
        if (p.marca) count.set(p.marca, (count.get(p.marca) ?? 0) + 1);
      }
      return [...count.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
        .map(([nombre]) => nombre);
    } catch (e) {
      logDbError("getMarcas", e);
      return mockSource.getMarcas();
    }
  },

  async getProductos(query: CatalogQuery = {}): Promise<Producto[]> {
    try {
      let productos = await cargarProductos();
      if (query.marca) {
        productos = productos.filter((p) => p.marca === query.marca);
      }
      if (query.search) {
        const q = query.search.toLowerCase().trim();
        productos = productos.filter(
          (p) =>
            p.nombre.toLowerCase().includes(q) ||
            (p.marca ?? "").toLowerCase().includes(q) ||
            (p.sku ?? "").toLowerCase().includes(q)
        );
      }
      return productos;
    } catch (e) {
      logDbError("getProductos", e);
      return mockSource.getProductos(query);
    }
  },
};
