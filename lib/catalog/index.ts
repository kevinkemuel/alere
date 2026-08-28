import { CatalogSource } from "./types";
import { mockSource } from "./mock";
import { dbSource } from "./db";

export * from "./types";

/**
 * Selector de fuente de datos del catálogo.
 * ─────────────────────────────────────────────────────────────
 * Usa la base real de Komercio (Postgres/Supabase vía Prisma) cuando está
 * definida DATABASE_URL y NEXT_PUBLIC_USE_MOCK !== "true"; de lo contrario
 * usa datos de muestra.
 *
 * Para conectar el catálogo real: define DATABASE_URL (y DIRECT_URL) en
 * `.env.local` — ver `.env.example`.
 */
const hasDatabase = !!process.env.DATABASE_URL;
const forceMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const usingMock = forceMock || !hasDatabase;

export const catalog: CatalogSource = usingMock ? mockSource : dbSource;
