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
  },
};

export default nextConfig;
