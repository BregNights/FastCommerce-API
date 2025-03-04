import { verifyToken } from "../middlewares/auth.jwt.js";
import { userFields, isValidEmail } from "../middlewares/validators.register.js";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  addProduct,
  getProducts,
  addOrder,
  getOrders,
} from "../controllers/user.controller.js";

async function userRoutes(app) {
  app.post(
    "/register",
    { preHandler: [userFields, isValidEmail] },
    registerUser
  );
  app.post("/login", loginUser);
  app.get("/getuser", { preHandler: verifyToken }, getUser);
  app.put("/updateuser/:id", { preHandler: verifyToken }, updateUser);
  app.delete("/deleteuser/:id", { preHandler: verifyToken }, deleteUser);

  app.post("/addproduct", { preHandler: verifyToken }, addProduct);
  app.get("/getproducts", getProducts);

  app.post("/addorder", { preHandler: verifyToken }, addOrder);
  app.get("/getorders", { preHandler: verifyToken }, getOrders);
}

export default userRoutes;
