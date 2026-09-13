import { cache } from "react";
import {
  CatalogMeta,
  CatalogQuery,
  CatalogSource,
  Producto,
  calcDisponibilidad,
} from "./types";
import { mockSource } from "./mock";
import { getSupabase } from "../supabase";
import { site } from "../site";
import { toNumber } from "../format";

/**
 * Fuente de datos vía API REST de Supabase (HTTPS).
 * Espeja la lógica de `db.ts` (Prisma) pero sin conexión directa a Postgres.
 * SOLO LECTURA. Ver `lib/supabase.ts` para las variables de entorno.
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

// Carga cacheada por request (dedup entre getMeta/getMarcas/getProductos).
const loadNegocio = cache(
  async (): Promise<{
    id: string;
    nombre: string;
    catalogoMostrarStock: boolean;
    catalogoMostrarBs: boolean;
  } | null> => {
    const sb = getSupabase();
    if (!sb) return null;
    const id = site.catalogoId;
    const { data, error } = await sb
      .from("Negocio")
      .select("id, nombre, catalogoMostrarStock, catalogoMostrarBs")
      .or(`catalogoToken.eq.${id},catalogoSlug.eq.${id}`)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
);

const PRODUCTO_COLS =
  "id, nombre, descripcion, imagenUrl, imagenesExtra, precioVentaUSD, stockActual, stockMinimo";

const cargarProductos = cache(async (): Promise<Producto[]> => {
  const sb = getSupabase();
  if (!sb) return [];
  const negocio = await loadNegocio();
  if (!negocio) return [];

  // Intento con categorías embebidas (relaciones FK de PostgREST).
  const withCats = await sb
    .from("Producto")
    .select(`${PRODUCTO_COLS}, ProductoCategoria(Categoria(nombre))`)
    .eq("negocioId", negocio.id)
    .eq("activo", true)
    .order("nombre", { ascending: true })
    .limit(2000);

  let rows = withCats.data as RawProducto[] | null;

  if (withCats.error) {
    // Reintento sin el embed por si la relación no resuelve; los productos
    // (nombre, precio, stock, fotos) son lo importante — las categorías no.
    const plain = await sb
      .from("Producto")
      .select(PRODUCTO_COLS)
      .eq("negocioId", negocio.id)
      .eq("activo", true)
      .order("nombre", { ascending: true })
      .limit(2000);
    if (plain.error) throw plain.error;
    rows = plain.data as RawProducto[] | null;
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
