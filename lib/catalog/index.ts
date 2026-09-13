import { CatalogSource } from "./types";
import { mockSource } from "./mock";
import { dbSource } from "./db";
import { supabaseSource } from "./supabaseSource";
import { supabaseConfigured } from "../supabase";

export * from "./types";

/**
 * Selector de fuente de datos del catálogo.
 * ─────────────────────────────────────────────────────────────
 * Prioridad:
 *   1. API REST de Supabase (HTTPS) — si SUPABASE_URL + key están definidas.
 *      Sirve en hostings que bloquean la conexión directa a Postgres
 *      (p. ej. cPanel), porque va por el puerto 443.
 *   2. Postgres directo vía Prisma — si hay DATABASE_URL (Vercel/local).
 *   3. Datos de muestra — si no hay nada configurado o NEXT_PUBLIC_USE_MOCK.
 *
 * Ver `lib/supabase.ts` y `.env.example` para las variables de entorno.
 */
const hasDatabase = !!process.env.DATABASE_URL;
const forceMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const usingMock = forceMock || (!supabaseConfigured && !hasDatabase);

export const catalog: CatalogSource = forceMock
  ? mockSource
  : supabaseConfigured
    ? supabaseSource
    : hasDatabase
      ? dbSource
      : mockSource;
