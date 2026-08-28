import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/nosotros", "/catalogo", "/aliados", "/cotizar"];
  const now = new Date();
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "/catalogo" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
