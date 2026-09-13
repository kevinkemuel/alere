import { cache } from "react";
import {
  CatalogMeta,
  CatalogQuery,
  CatalogSource,
  Producto,
  calcDisponibilidad,
} from "./types";
import { mockSource } from "./mock";
import { SUPABASE_URL, SUPABASE_KEY, supabaseConfigured } from "../supabase";
import { site } from "../site";
import { toNumber } from "../format";

/**
 * Fuente de datos vía API REST de Supabase (PostgREST) con `fetch` nativo.
 * Funciona por HTTPS (443), evitando el bloqueo del puerto de Postgres y la
 * dependencia de @supabase/supabase-js (que exige Node 22+). SOLO LECTURA.
 */

function logErr(where: string, e: unknown) {
  console.error(
    `[catalog:supabase] fallo en ${where} → usando datos de muestra:`,
    e instanceof Error ? e.message : e
  );
}

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

type RawProducto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  imagenesExtra: string[] | null;
  precioVentaUSD: number | string | null;
  stockActual: number | string | null;
  stockMinimo: number | string | null;
  ProductoCategoria?: { Categoria: { nombre: string | null } | null }[] | null;
};

function toProducto(p: RawProducto): Producto {
  const { nombre, marca } = splitNombreMarca(p.nombre);
  const inventario = Math.max(0, Math.round(toNumber(p.stockActual)));
  const bajo = Math.round(toNumber(p.stockMinimo)) || 5;
  const categorias = (p.ProductoCategoria ?? [])
    .map((pc) => pc?.Categoria?.nombre)
    .filter((n): n is string => !!n);
  // Foto principal + extras → lista sin vacíos ni duplicados, principal primero.
  const imagenes = [
    ...new Set(
      [p.imagenUrl, ...(p.imagenesExtra ?? [])]
        .map((u) => (typeof u === "string" ? u.trim() : ""))
        .filter((u): u is string => u.length > 0)
    ),
  ];
  return {
    id: p.id,
    sku: null, // `codigo` aquí es fecha de vencimiento, no SKU → se omite
    nombre,
    descripcion: p.descripcion ?? null,
    marca,
    precio: p.precioVentaUSD == null ? null : toNumber(p.precioVentaUSD),
    inventario,
    bajoInventario: bajo,
    imagen: imagenes[0] ?? null,
    imagenes,
    categorias,
    disponibilidad: calcDisponibilidad(inventario, bajo),
  };
}

// Cachea las respuestas de Supabase por este tiempo (segundos) para no
// consultar en cada visita y reducir el consumo hacia el proyecto de Komercio.
// Con stale-while-revalidate, el visitante nunca espera: ve lo cacheado y el
// refresco ocurre en segundo plano. Precios/stock con retraso máx. de este valor.
const REVALIDAR_SEGUNDOS = 900; // 15 minutos

/** GET a la API REST de Supabase. */
async function rest<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}?${qs}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: "application/json",
    },
    // Caché de datos de Next (se refresca cada REVALIDAR_SEGUNDOS).
    next: { revalidate: REVALIDAR_SEGUNDOS },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`REST ${path} → ${res.status} ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// Carga cacheada por request (dedup entre getMeta/getMarcas/getProductos).
const loadNegocio = cache(
  async (): Promise<{
    id: string;
    nombre: string;
    catalogoMostrarStock: boolean;
    catalogoMostrarBs: boolean;
  } | null> => {
    if (!supabaseConfigured) return null;
    const id = site.catalogoId;
    const rows = await rest<
      {
        id: string;
        nombre: string;
        catalogoMostrarStock: boolean;
        catalogoMostrarBs: boolean;
      }[]
    >("Negocio", {
      select: "id,nombre,catalogoMostrarStock,catalogoMostrarBs",
      or: `(catalogoToken.eq.${id},catalogoSlug.eq.${id})`,
      limit: "1",
    });
    return rows[0] ?? null;
  }
);

const cargarProductos = cache(async (): Promise<Producto[]> => {
  if (!supabaseConfigured) return [];
  const negocio = await loadNegocio();
  if (!negocio) return [];

  const base = {
    negocioId: `eq.${negocio.id}`,
    activo: "eq.true",
    order: "nombre.asc",
    limit: "2000",
  };

  let rows: RawProducto[];
  try {
    // Con categorías embebidas (relaciones FK de PostgREST).
    rows = await rest<RawProducto[]>("Producto", {
      ...base,
      select:
        "id,nombre,descripcion,imagenUrl,imagenesExtra,precioVentaUSD,stockActual,stockMinimo,ProductoCategoria(Categoria(nombre))",
    });
  } catch {
    // Reintento sin el embed por si la relación no resuelve.
    rows = await rest<RawProducto[]>("Producto", {
      ...base,
      select:
        "id,nombre,descripcion,imagenUrl,imagenesExtra,precioVentaUSD,stockActual,stockMinimo",
    });
  }

  return (rows ?? []).map(toProducto);
});

export const supabaseSource: CatalogSource = {
  async getMeta(): Promise<CatalogMeta> {
    try {
      const negocio = await loadNegocio();
      if (!negocio) return mockSource.getMeta();
      return {
        nombre: negocio.nombre,
        mostrarStock: !!negocio.catalogoMostrarStock,
        mostrarBs: !!negocio.catalogoMostrarBs,
      };
    } catch (e) {
      logErr("getMeta", e);
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
      logErr("getMarcas", e);
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
      logErr("getProductos", e);
      return mockSource.getProductos(query);
    }
  },
};
