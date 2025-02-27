import { verifyToken } from "../middlewares/auth.jwt.js";
import {
  registerUser,
  loginUser,
  getUser,
  editUser,
  deleteUser,
  addProduct,
  getProducts,
} from "../controllers/user.controller.js";

async function userRoutes(app) {
  app.post("/register", registerUser);
  app.post("/login", loginUser);
  app.get("/getUser", { preHandler: verifyToken }, getUser);
  app.put("/put/:id", { preHandler: verifyToken }, editUser);
  app.delete("/delete/:id", { preHandler: verifyToken }, deleteUser);

  app.post("/addproduct", { preHandler: verifyToken }, addProduct);
  app.get("/getproducts", getProducts);

  // app.post("/createorder", createOrder)
  // app.get("/getorders", getOrders)
}

export default userRoutes;
