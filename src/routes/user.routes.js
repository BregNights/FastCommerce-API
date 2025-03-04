import { verifyToken } from "../middlewares/auth.jwt.js";
import {
  userFields,
  isValidEmail,
} from "../middlewares/validators.register.js";
import { verifyUserId } from "../middlewares/validators.update.delete.js";
import {  addProduct,
  getProducts,
  addOrder,
  getOrders} from "../controllers/product.controller.js";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

async function userRoutes(app) {
  app.post(
    "/register",
    { preHandler: [userFields, isValidEmail] },
    registerUser
  );
  app.post("/login", loginUser);
  app.get("/getuser", { preHandler: verifyToken }, getUser);
  app.put(
    "/updateuser/:id",
    { preHandler: [verifyToken, verifyUserId] },
    updateUser
  );
  app.delete(
    "/deleteuser/:id",
    { preHandler: [verifyToken, verifyUserId] },
    deleteUser
  );

  app.post("/addproduct", { preHandler: verifyToken }, addProduct);
  app.get("/getproducts", getProducts);

  app.post("/addorder", { preHandler: verifyToken }, addOrder);
  app.get("/getorders", { preHandler: verifyToken }, getOrders);
}

export default userRoutes;
