import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase (API REST sobre HTTPS).
 * ─────────────────────────────────────────────────────────────
 * Alternativa a la conexión directa a Postgres (Prisma) para hostings que
 * bloquean la salida a los puertos de base de datos (5432/6543) pero permiten
 * HTTPS (443) — p. ej. cPanel/CloudLinux compartido.
 *
 * Variables de entorno (SOLO servidor — nunca usar prefijo NEXT_PUBLIC_ para la
 * service key):
 *   SUPABASE_URL          → https://<ref>.supabase.co
 *   SUPABASE_SERVICE_KEY  → service_role (lee saltándose RLS)  [recomendada]
 *   SUPABASE_KEY / SUPABASE_ANON_KEY → alternativa (requiere políticas de lectura)
 */
const url = process.env.SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY;

export const supabaseConfigured = !!(url && key);

let client: SupabaseClient | null = null;

/** Devuelve el cliente singleton, o null si no está configurado. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
