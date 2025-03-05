import { verifyToken } from "../middlewares/auth.jwt.js";
import {
  checkUserFields,
  isValidEmail,
} from "../middlewares/check.register.js";
import {
  checkUserId,
  checkUserParamsAndId,
} from "../middlewares/check.update.delete.js";
import { checkAddProduct } from "../middlewares/check.addproduct.js";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { addProduct, getProducts } from "../controllers/product.controller.js";
import { addOrder, getOrders } from "../controllers/order.controller.js";

async function userRoutes(app) {
  app.post(
    "/register",
    { preHandler: [checkUserFields, isValidEmail] },
    registerUser
  );
  app.post("/login", loginUser);
  app.get("/getuser", { preHandler: verifyToken }, getUser);
  app.put(
    "/updateuser/:id",
    { preHandler: [verifyToken, checkUserId, checkUserParamsAndId] },
    updateUser
  );
  app.delete(
    "/deleteuser/:id",
    { preHandler: [verifyToken, checkUserId, checkUserParamsAndId] },
    deleteUser
  );

  app.post(
    "/addproduct",
    { preHandler: [verifyToken, checkAddProduct] },
    addProduct
  );
  app.get("/getproducts", getProducts);

  app.post("/addorder", { preHandler: verifyToken }, addOrder);
  app.get("/getorders", { preHandler: verifyToken }, getOrders);
}

export default userRoutes;
