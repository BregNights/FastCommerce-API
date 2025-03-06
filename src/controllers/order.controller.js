import { database } from "../controllers/user.controller.js";
import {
  isValidOrderId,
  isValidProductId,
  validationProduct,
  checkQuantity,
} from "../utils/validators.js";

export async function addOrder(request, reply) {
  try {
    const userId = request.user.id;
    const { status = "pending", products } = request.body;

    let total_price = 0;

    for (const product of products) {
      const resultProduct = validationProduct(product);
      if (resultProduct.error) {
        return reply.status(400).send({ message: resultProduct.error });
      }

      const dbProductResult = await isValidProductId(resultProduct.id);
      if (dbProductResult.error) {
        return reply.status(404).send({ message: dbProductResult.error });
      }

      const stockDb = dbProductResult.stock;
      const quantityUser = product.quantity;
      const verifyStock = checkQuantity(stockDb, quantityUser);
      if (verifyStock.error) {
        return reply.status(400).send({ message: verifyStock.error });
      }

      const itemTotal = dbProductResult.price * product.quantity;
      total_price += itemTotal;
    }

    const order = await database.addOrder({ user_id: userId, status });

    for (const product of products) {
      console.log(product);
      console.log(order);
      const productPrice = await database.getProductPrice(product.id);

      await database.addOrderItem({
        order_id: order.id,
        product_id: product.id,
        quantity: product.quantity,
        price: productPrice,
      });

      await database.updateProductStock({
        product_id: product.id,
        quantity: product.quantity,
      });
    }

    return reply.status(201).send({
      message: "Pedido criado com sucesso!",
      order_id: order.id,
      total_price,
    });
  } catch (error) {
    console.error("Erro ao processar pedido:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function getOrders(request, reply) {
  try {
    const userId = request.user.id;
    const result = await isValidOrderId(userId);
    if (result.error) {
      return reply.status(400).send({ message: result.error });
    }

    const getIdOrders = await database.getOrderId(result);
    const showOrders = await database.getOrders(getIdOrders.id);

    return reply.status(200).send({ showOrders });
  } catch (error) {
    console.error("Erro na consulta dos pedidos:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}
