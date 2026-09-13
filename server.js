// Servidor de arranque para hosting tipo cPanel / Passenger (Node.js App).
// Vercel NO usa este archivo; solo aplica cuando se ejecuta con `node server.js`.
const path = require("path");
// Carga las variables de entorno desde un .env del propio proyecto.
// cPanel/LiteSpeed no siempre inyecta las env vars del panel al proceso Node,
// así que aquí garantizamos que DATABASE_URL esté disponible para Prisma.
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { createServer } = require("http");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> Alere's listo en el puerto ${port}`);
  });
});
