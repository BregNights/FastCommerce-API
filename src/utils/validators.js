import { database } from "../controllers/user.controller.js";

export async function isValidUserId(id) {
  const user = await database.findById(id);

  if (!user) {
    return { error: "Usuário não encontrado" };
  }
  return user;
}

export function isAuthorizedUser(idparams, idtoken) {
  if (String(idparams) !== String(idtoken)) {
    return { error: "Ação não permitida." };
  }
  return true;
}

export async function isValidOrderId(id) {
  const orderId = await database.getOrderId(id);
  if (!orderId) {
    return { error: "Não há pedidos em sua conta." };
  }
}

export function validationProduct(product) {
  if (
    !product.id ||
    typeof product.id !== "number" ||
    !product.quantity ||
    typeof product.quantity !== "number" ||
    product.quantity <= 0
  ) {
    return { error: "Produto inválido ou quantidade incorreta" };
  }
  return product;
}

export async function isValidProductId(id) {
  const productId = await database.getProductById(id);
  if (!productId) {
    return { error: `Produto não encontrado` };
  }
  return productId;
}

export function checkQuantity(dbStock, userQuantity) {
  if (dbStock < userQuantity) {
    return { error: `Estoque insuficiente` };
  }
}
