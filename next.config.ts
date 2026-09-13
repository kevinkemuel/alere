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
};

export default nextConfig;
