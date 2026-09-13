import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos de producto de Komercio (host propio) + Supabase Storage por si acaso.
    remotePatterns: [
      { protocol: "https", hostname: "img.komercio.nexaflowia.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
  // Hosting compartido (CloudLinux) limita el nº de procesos/hilos por cuenta.
  // Sin esto, `next build` intenta usar 1 worker por núcleo del servidor
  // físico (~12) y revienta con "pthread_create: Resource temporarily
  // unavailable". Forzamos 1 worker para no exceder el límite.
  experimental: {
    cpus: 1,
    // Compila en el proceso principal (no en un worker aparte), para que el
    // límite de memoria (NODE_OPTIONS) aplique directo y no lo mate el OOM.
    webpackBuildWorker: false,
  },
  // Hosting con poca RAM: la minificación (Terser) dispara el uso de memoria y
  // hace que el build muera por OOM (SIGKILL). La desactivamos: el JS pesa algo
  // más, pero el build cabe en la memoria de la cuenta. Aceptable para el sitio.
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
