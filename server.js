import { fastify } from "fastify";
import userRoutes from "./src/routes/user.routes.js";
import "dotenv/config";

const app = fastify();
app.register(userRoutes);

app.listen(
  {
    port: process.env.PORT || 3333,
  },
  () => {
    console.log("Servidor rodando na porta 3333");
  }
);
