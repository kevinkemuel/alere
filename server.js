// Servidor de arranque para hosting tipo cPanel / Passenger (Node.js App).
// Vercel NO usa este archivo; solo aplica cuando se ejecuta con `node server.js`.
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
