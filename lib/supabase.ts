/**
 * Configuración de Supabase REST.
 * ─────────────────────────────────────────────────────────────
 * NO usamos la librería @supabase/supabase-js: su cliente Realtime exige
 * WebSocket nativo (Node 22+) y el hosting corre Node 20. Como solo LEEMOS,
 * llamamos la API REST (PostgREST) con `fetch` nativo por HTTPS (443).
 * Ver `lib/catalog/supabaseSource.ts`.
 *
 * Variables de entorno (SOLO servidor — nunca prefijo NEXT_PUBLIC_ para la
 * service key):
 *   SUPABASE_URL          → https://<ref>.supabase.co
 *   SUPABASE_SERVICE_KEY  → service_role (lee saltándose RLS)  [recomendada]
 *   SUPABASE_KEY / SUPABASE_ANON_KEY → alternativa (requiere políticas de lectura)
 */
export const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");

export const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const supabaseConfigured = !!(SUPABASE_URL && SUPABASE_KEY);
