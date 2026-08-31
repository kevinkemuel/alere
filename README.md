# Alere's — Sitio web

Sitio web multipágina para **Alere's — Laboratorio y Suministros**: presenta la
marca y muestra el catálogo de productos (precio y stock) consumiendo la misma
fuente de datos que usa Komercio, con el diseño de marca de Alere's.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript ·
`@supabase/supabase-js` · `lucide-react`.

---

## Desarrollo

```bash
npm run dev     # servidor de desarrollo (http://localhost:3000)
npm run build   # build de producción
npm run start   # sirve el build
npm run lint
```

Sin variables de entorno, el sitio usa **datos de muestra** automáticamente.

---

## Páginas

| Ruta         | Descripción                                                        |
| ------------ | ------------------------------------------------------------------ |
| `/`          | Inicio: hero, confianza, categorías, propuesta de valor, destacados |
| `/nosotros`  | Quiénes somos, valores, métricas                                   |
| `/catalogo`  | Búsqueda + filtro por categoría + grid con precio/stock            |
| `/cotizar`   | Formulario de cotización (arma mensaje de WhatsApp) + contacto      |
| `/aliados`   | Marcas aliadas (placeholder — reemplazar por logos reales)          |

Botón flotante de WhatsApp global (`components/layout/WhatsAppFAB.tsx`).

---

## Conectar el catálogo real (Komercio / Supabase)

Todo el sitio ya consume un **adaptador** (`lib/catalog/`). Conectar la fuente
real es un cambio acotado:

1. **Inspeccionar** la URL pública del catálogo compartido de Komercio para
   Alere's (DevTools → Network → Fetch/XHR) y confirmar:
   - Nombre de la tabla (se asume `productos_catalogo`).
   - Nombres de columnas y relaciones (fotos, categorías).
   - Valores que marcan visible/publicado (se asume `'1'`).
   - Si el negocio se distingue por columna (`negocio_id`) o por proyecto propio.
2. Ajustar las constantes al inicio de **`lib/catalog/supabase.ts`** según lo
   observado (tabla, columnas, valores, filtro de negocio).
3. Crear **`.env.local`** (ver `.env.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. Listo: `lib/catalog/index.ts` detecta las claves y cambia de datos de muestra
   a Supabase. La consulta es **solo lectura** y filtra por `visible_catalogo`
   y `publicado` (equivalente a la policy de datos públicos que ya usa Komercio).

> Para forzar datos de muestra aunque existan las claves: `NEXT_PUBLIC_USE_MOCK=true`.

### Arquitectura de datos

```
lib/catalog/
  types.ts      Tipos normalizados (Producto, Categoria) + disponibilidad
  source.ts →   (interfaz CatalogSource, en types.ts)
  mock.ts       Fuente de MUESTRA (catálogo de laboratorio de ejemplo)
  supabase.ts   Fuente REAL (Komercio) — solo lectura, ajustar constantes
  index.ts      Selector por entorno → exporta `catalog` y `usingMock`
```

---

## Placeholders a reemplazar (buscar `TODO`)

- **`lib/site.ts`** — número de WhatsApp, correo, teléfono, dirección, cobertura,
  horario, redes sociales, dominio y moneda.
- **`/aliados`** — logos/nombres de marcas reales.
- **Textos de `/nosotros`** — historia real de la empresa (hoy son textos base).
- **Assets de marca** — en `public/brand/` (ver abajo).

---

## Marca

Dirección: **bicolor editorial** — cuerpo en papel cálido (`#faf6f4`) con
secciones oscuras plomo-vino (`#17060f`, `bg-ink-gradient`) en hero, paneles y
footer. Acento magenta `#9E0864` (escala `magenta-50…900`) + `magenta-glow`
`#ff3fa2`. Tokens en `app/globals.css` (`@theme`).

Tipografía: **Space Grotesk** (títulos, `font-display`), **Inter** (texto) y
**JetBrains Mono** (datos técnicos: SKU, precios, stock — clases `.label` /
`.index-num`). Motivo visual: el "pliegue/chevron" del isotipo
(`components/ui/Chevron.tsx`).

Movimiento: **Framer Motion** (`motion`). Primitivos en `components/motion/`
(`Reveal`/`Stagger`, `Counter`, `Marquee`, `Magnetic`) y transición de página en
`app/template.tsx`. Todo respeta `prefers-reduced-motion`.

Logos en `public/brand/` (fuente vectorial: `alere-logo-source.ai`):

| Archivo                          | Uso                                  |
| -------------------------------- | ------------------------------------ |
| `alere-lockup-magenta.png`       | Header (fondo claro)                 |
| `alere-lockup-white.png`         | Footer / fondos magenta              |
| `alere-lockup-black.png`         | Versión negra                        |
| `alere-iso-silver.png`           | Isotipo hero (sobre magenta)         |
| `alere-iso-on-magenta.png`       | Favicon / app icon (`app/icon.png`)  |
| `alere-iso-white` / `-black`     | Variantes del isotipo                |

Componente `components/ui/Logo.tsx` centraliza las variantes.
