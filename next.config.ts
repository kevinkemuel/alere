import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sin optimización en el servidor: las imágenes se sirven con su URL
    // original, así el navegador las carga DIRECTO desde la CDN de Komercio
    // (img.komercio.nexaflowia.com). Ahorra ancho de banda y CPU en el hosting
    // (que es muy justo de recursos) y no proxea las imágenes por nuestro server.
    unoptimized: true,
    // Fotos de producto de Komercio (host propio) + Supabase Storage por si acaso.
    remotePatterns: [
      { protocol: "https", hostname: "img.komercio.nexaflowia.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
};

export default nextConfig;
