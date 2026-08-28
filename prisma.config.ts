import "dotenv/config";
import { defineConfig } from "prisma/config";

// Nota: NO se hardcodean credenciales aquí. La URL viene solo de .env.local /
// variables de entorno del servidor. Este proyecto no ejecuta migraciones
// (la fuente de verdad del esquema es la app de Komercio).
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
