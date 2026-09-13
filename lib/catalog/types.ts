/**
 * Tipos del catálogo — espejo del esquema `productos_catalogo` que usa
 * Komercio (mismo patrón que maxipet-admin-catalogo).
 *
 * En la base, varias columnas numéricas se guardan como TEXTO (string).
 * La capa de fuente (source) las normaliza a los tipos de abajo antes de
 * entregarlas a la UI, de modo que los componentes nunca lidian con eso.
 */

/** Categoría del catálogo. */
export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

/** Disponibilidad derivada de inventario + umbral de bajo inventario. */
export type Disponibilidad = "disponible" | "bajo" | "agotado";

/** Producto normalizado, listo para renderizar en la UI. */
export interface Producto {
  id: string;
  sku: string | null;
  nombre: string;
  descripcion: string | null;
  marca: string | null;
  /** Precio ya como número (o null si no publicado/sin precio). */
  precio: number | null;
  /** Unidades en inventario (número; 0 si agotado). */
  inventario: number;
  /** Umbral para marcar "pocas unidades". */
  bajoInventario: number;
  /** URL de la foto principal, o null. */
  imagen: string | null;
  /** Todas las fotos (principal + extras de Komercio), sin vacíos ni duplicados. Puede estar vacío. */
  imagenes: string[];
  /** Nombres de categorías a las que pertenece. */
  categorias: string[];
  /** Disponibilidad calculada. */
  disponibilidad: Disponibilidad;
}

/** Opciones de consulta del catálogo. */
export interface CatalogQuery {
  search?: string;
  /** marca/fabricante exacto para filtrar. */
  marca?: string;
}

/** Ajustes/branding del negocio para el catálogo. */
export interface CatalogMeta {
  nombre: string;
  /** Si el negocio muestra stock/disponibilidad en su catálogo. */
  mostrarStock: boolean;
  /** Si el negocio muestra precios en Bs además de USD. */
  mostrarBs: boolean;
}

/** Contrato que cualquier fuente de datos (mock o BD real) debe cumplir. */
export interface CatalogSource {
  getMeta(): Promise<CatalogMeta>;
  /** Marcas/fabricantes distintos, ordenados por frecuencia. */
  getMarcas(): Promise<string[]>;
  getProductos(query?: CatalogQuery): Promise<Producto[]>;
}

/** Calcula disponibilidad a partir de inventario y umbral. */
export function calcDisponibilidad(
  inventario: number,
  bajoInventario: number
): Disponibilidad {
  if (inventario <= 0) return "agotado";
  if (inventario <= bajoInventario) return "bajo";
  return "disponible";
}
