import { verifyToken } from "../middlewares/auth.jwt.js";
import {
  registerUser,
  loginUser,
  getUser,
  editUser,
  deleteUser,
} from "../controllers/user.controller.js";

async function userRoutes(app) {
  app.post("/register", registerUser);
  app.post("/login", loginUser);
  app.get("/get", { preHandler: verifyToken }, getUser);
  app.put("/put/:id", { preHandler: verifyToken }, editUser);
  app.delete("/delete/:id", { preHandler: verifyToken }, deleteUser);
}

export default userRoutes;
