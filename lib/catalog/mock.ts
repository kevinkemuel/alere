import {
  CatalogQuery,
  CatalogSource,
  Categoria,
  Producto,
  calcDisponibilidad,
} from "./types";

/**
 * Fuente de datos de MUESTRA.
 * ─────────────────────────────────────────────────────────────
 * Reproduce la forma de `productos_catalogo` de Komercio para que la
 * UI se construya y pruebe sin depender de la base real. Se reemplaza
 * por la fuente de Supabase apagando NEXT_PUBLIC_USE_MOCK (ver index.ts).
 * Los datos aquí son ilustrativos.
 */

const CATEGORIAS: Categoria[] = [
  { id: 1, nombre: "Reactivos", slug: "reactivos" },
  { id: 2, nombre: "Consumibles descartables", slug: "consumibles" },
  { id: 3, nombre: "Cristalería", slug: "cristaleria" },
  { id: 4, nombre: "Equipos", slug: "equipos" },
  { id: 5, nombre: "Puntas y microtubos", slug: "puntas-microtubos" },
  { id: 6, nombre: "Bioseguridad (EPP)", slug: "bioseguridad" },
  { id: 7, nombre: "Tubos de recolección", slug: "tubos-recoleccion" },
  { id: 8, nombre: "Medios de cultivo", slug: "medios-cultivo" },
];

type Row = {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string;
  marca: string;
  precio: number;
  inventario: number;
  bajo: number;
  cats: string[];
};

const ROWS: Row[] = [
  {
    id: 1,
    sku: "REA-0101",
    nombre: "Reactivo de glucosa GOD-PAP (1 L)",
    descripcion:
      "Kit enzimático para determinación cuantitativa de glucosa en suero y plasma. Presentación de 1 litro.",
    marca: "Wiener lab",
    precio: 42.5,
    inventario: 34,
    bajo: 8,
    cats: ["reactivos"],
  },
  {
    id: 2,
    sku: "REA-0114",
    nombre: "Colesterol total CHOD-PAP (4×100 mL)",
    descripcion:
      "Reactivo para determinación de colesterol total por método enzimático colorimétrico.",
    marca: "Human",
    precio: 58.9,
    inventario: 12,
    bajo: 6,
    cats: ["reactivos"],
  },
  {
    id: 3,
    sku: "REA-0130",
    nombre: "Tiras reactivas de uroanálisis 10 parámetros",
    descripcion:
      "Frasco x 100 tiras para análisis semicuantitativo de orina (pH, glucosa, proteínas, cetonas y más).",
    marca: "Cypress Diagnostics",
    precio: 19.75,
    inventario: 0,
    bajo: 10,
    cats: ["reactivos", "consumibles"],
  },
  {
    id: 4,
    sku: "CON-0210",
    nombre: "Guantes de nitrilo sin polvo (caja x 100)",
    descripcion:
      "Guantes de examen de nitrilo, sin polvo, ambidiestros. Talla M. Alta resistencia química.",
    marca: "Kimberly-Clark",
    precio: 9.9,
    inventario: 220,
    bajo: 40,
    cats: ["consumibles", "bioseguridad"],
  },
  {
    id: 5,
    sku: "CON-0225",
    nombre: "Jeringas estériles 5 mL con aguja (caja x 100)",
    descripcion:
      "Jeringas descartables estériles de 5 mL con aguja 21G. Empaque individual.",
    marca: "Nipro",
    precio: 12.4,
    inventario: 75,
    bajo: 20,
    cats: ["consumibles"],
  },
  {
    id: 6,
    sku: "CON-0240",
    nombre: "Torundas de algodón estériles (bolsa x 500)",
    descripcion: "Torundas de algodón hidrófilo para toma de muestra y curación.",
    marca: "Genérico",
    precio: 4.5,
    inventario: 60,
    bajo: 15,
    cats: ["consumibles"],
  },
  {
    id: 7,
    sku: "CRI-0305",
    nombre: "Tubos de ensayo 12×75 mm (paquete x 250)",
    descripcion: "Tubos de vidrio borosilicato sin reborde. Uso general de laboratorio.",
    marca: "Corning",
    precio: 22.0,
    inventario: 40,
    bajo: 10,
    cats: ["cristaleria"],
  },
  {
    id: 8,
    sku: "CRI-0320",
    nombre: "Beaker (vaso de precipitado) 250 mL",
    descripcion: "Vaso de precipitado de vidrio borosilicato con graduación y pico.",
    marca: "Pyrex",
    precio: 6.8,
    inventario: 28,
    bajo: 8,
    cats: ["cristaleria"],
  },
  {
    id: 9,
    sku: "CRI-0330",
    nombre: "Pipeta volumétrica clase A 10 mL",
    descripcion: "Pipeta volumétrica de vidrio, clase A, con certificado de tolerancia.",
    marca: "Brand",
    precio: 8.25,
    inventario: 5,
    bajo: 6,
    cats: ["cristaleria"],
  },
  {
    id: 10,
    sku: "EQU-0402",
    nombre: "Microscopio binocular biológico LED",
    descripcion:
      "Microscopio binocular con objetivos 4×, 10×, 40× y 100×, iluminación LED y condensador Abbe.",
    marca: "Labomed",
    precio: 389.0,
    inventario: 4,
    bajo: 2,
    cats: ["equipos"],
  },
  {
    id: 11,
    sku: "EQU-0418",
    nombre: "Centrífuga de 8 tubos 4000 rpm",
    descripcion:
      "Centrífuga clínica de mesa para 8 tubos de 15 mL, temporizador y control de velocidad.",
    marca: "Gemmy",
    precio: 245.0,
    inventario: 3,
    bajo: 2,
    cats: ["equipos"],
  },
  {
    id: 12,
    sku: "EQU-0425",
    nombre: "Baño María digital 6 L",
    descripcion: "Baño de agua con control digital de temperatura hasta 100 °C, capacidad 6 litros.",
    marca: "Memmert",
    precio: 310.0,
    inventario: 0,
    bajo: 1,
    cats: ["equipos"],
  },
  {
    id: 13,
    sku: "PUN-0510",
    nombre: "Puntas para micropipeta 200 µL (bolsa x 1000)",
    descripcion: "Puntas amarillas universales de 0–200 µL, libres de DNasa/RNasa.",
    marca: "Axygen",
    precio: 7.5,
    inventario: 150,
    bajo: 30,
    cats: ["puntas-microtubos"],
  },
  {
    id: 14,
    sku: "PUN-0520",
    nombre: "Microtubos 1.5 mL con tapa (bolsa x 500)",
    descripcion: "Microtubos tipo Eppendorf de 1.5 mL, graduados, autoclavables.",
    marca: "Eppendorf",
    precio: 11.9,
    inventario: 90,
    bajo: 20,
    cats: ["puntas-microtubos"],
  },
  {
    id: 15,
    sku: "BIO-0605",
    nombre: "Mascarillas quirúrgicas tricapa (caja x 50)",
    descripcion: "Mascarillas descartables de 3 capas con clip nasal y elástico.",
    marca: "Genérico",
    precio: 5.2,
    inventario: 300,
    bajo: 50,
    cats: ["bioseguridad"],
  },
  {
    id: 16,
    sku: "BIO-0612",
    nombre: "Bata de laboratorio manga larga (unidad)",
    descripcion: "Bata blanca de tela antifluido, manga larga, con bolsillos. Tallas S–XL.",
    marca: "Genérico",
    precio: 14.0,
    inventario: 18,
    bajo: 6,
    cats: ["bioseguridad"],
  },
  {
    id: 17,
    sku: "BIO-0620",
    nombre: "Contenedor para material punzocortante 2 L",
    descripcion: "Guardián rígido para descarte seguro de agujas y objetos punzocortantes.",
    marca: "Genérico",
    precio: 3.9,
    inventario: 7,
    bajo: 10,
    cats: ["bioseguridad", "consumibles"],
  },
  {
    id: 18,
    sku: "TUB-0702",
    nombre: "Tubos al vacío EDTA K2 tapa lila (caja x 100)",
    descripcion:
      "Tubos de recolección al vacío 4 mL con EDTA K2 para hematología. Tapa lila.",
    marca: "BD Vacutainer",
    precio: 16.5,
    inventario: 48,
    bajo: 12,
    cats: ["tubos-recoleccion", "consumibles"],
  },
  {
    id: 19,
    sku: "TUB-0710",
    nombre: "Tubos al vacío con gel separador tapa amarilla (caja x 100)",
    descripcion:
      "Tubos SST con activador de coágulo y gel separador para química clínica. Tapa amarilla.",
    marca: "BD Vacutainer",
    precio: 18.9,
    inventario: 30,
    bajo: 12,
    cats: ["tubos-recoleccion"],
  },
  {
    id: 20,
    sku: "MED-0808",
    nombre: "Agar sangre base (500 g)",
    descripcion:
      "Medio deshidratado base para preparación de agar sangre. Frasco de 500 g.",
    marca: "Oxoid",
    precio: 64.0,
    inventario: 9,
    bajo: 4,
    cats: ["medios-cultivo"],
  },
  {
    id: 21,
    sku: "MED-0815",
    nombre: "Caldo tioglicolato (500 g)",
    descripcion: "Medio de enriquecimiento para cultivo de anaerobios y aerobios.",
    marca: "Merck",
    precio: 71.0,
    inventario: 6,
    bajo: 4,
    cats: ["medios-cultivo"],
  },
  {
    id: 22,
    sku: "CON-0250",
    nombre: "Portaobjetos esmerilados (caja x 50)",
    descripcion: "Láminas portaobjetos con extremo esmerilado para rotulado. 26×76 mm.",
    marca: "Citoglas",
    precio: 3.2,
    inventario: 120,
    bajo: 25,
    cats: ["consumibles", "cristaleria"],
  },
  {
    id: 23,
    sku: "REA-0140",
    nombre: "Solución de Turk para conteo de leucocitos (100 mL)",
    descripcion: "Reactivo de dilución y lisis para recuento manual de glóbulos blancos.",
    marca: "Cromakit",
    precio: 8.9,
    inventario: 22,
    bajo: 8,
    cats: ["reactivos"],
  },
  {
    id: 24,
    sku: "EQU-0430",
    nombre: "Micropipeta monocanal volumen variable 100–1000 µL",
    descripcion: "Micropipeta autoclavable con expulsor de puntas y calibración de fábrica.",
    marca: "Dragon Lab",
    precio: 96.0,
    inventario: 11,
    bajo: 3,
    cats: ["equipos", "puntas-microtubos"],
  },
];

const catNombre = (slug: string) =>
  CATEGORIAS.find((c) => c.slug === slug)?.nombre ?? slug;

function toProducto(r: Row): Producto {
  return {
    id: String(r.id),
    sku: r.sku,
    nombre: r.nombre,
    descripcion: r.descripcion,
    marca: r.marca,
    precio: r.precio,
    inventario: r.inventario,
    bajoInventario: r.bajo,
    imagen: null, // sin foto en muestra → placeholder de marca en la UI
    categorias: r.cats.map(catNombre),
    disponibilidad: calcDisponibilidad(r.inventario, r.bajo),
  };
}

export const mockSource: CatalogSource = {
  async getMeta() {
    return {
      nombre: "Aalere's (datos de muestra)",
      mostrarStock: true,
      mostrarBs: false,
    };
  },

  async getMarcas() {
    const count = new Map<string, number>();
    for (const r of ROWS) if (r.marca) count.set(r.marca, (count.get(r.marca) ?? 0) + 1);
    return [...count.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
      .map(([nombre]) => nombre);
  },

  async getProductos(query: CatalogQuery = {}) {
    let rows = ROWS;

    if (query.marca) {
      rows = rows.filter((r) => r.marca === query.marca);
    }

    if (query.search) {
      const q = query.search.toLowerCase().trim();
      rows = rows.filter(
        (r) =>
          r.nombre.toLowerCase().includes(q) ||
          r.marca.toLowerCase().includes(q) ||
          r.sku.toLowerCase().includes(q)
      );
    }

    return rows.map(toProducto);
  },
};
