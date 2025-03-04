import { database } from "../controllers/user.controller.js";

export async function addOrder(request, reply) {
  try {
    const userId = request.user.id;
    const { status = "pending", products } = request.body;

    let total_price = 0;

    const order = await database.addOrder({ user_id: userId, status });

    for (const product of products) {
      if (!product.id || !product.quantity || product.quantity <= 0) {
        return reply
          .status(400)
          .send({ message: "Produto inválido ou quantidade incorreta" });
      }

      const dbProduct = await database.getProductById(product.id);

      if (!dbProduct) {
        return reply
          .status(404)
          .send({ message: `Produto ID ${product.id} não encontrado` });
      }

      if (dbProduct.stock < product.quantity) {
        return reply
          .status(400)
          .send({ message: `Estoque insuficiente para ${dbProduct.name}` });
      }

      const itemTotal = dbProduct.price * product.quantity;
      total_price += itemTotal;

      const productPrice = await database.getProductPrice(product.id);

      await database.addOrderItem({
        order_id: order.id,
        product_id: product.id,
        quantity: product.quantity,
        price: productPrice,
      });

      await database.updateProductStock({
        product_id: dbProduct.id,
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
    const orderId = await database.getOrderId(userId);
    if (!orderId) {
      return reply
        .status(400)
        .send({ message: "Não há pedidos em sua conta." });
    }
    const getItems = await database.getItems(orderId.id);
    return reply.status(200).send({ getItems });
  } catch (error) {
    console.error("Erro na consulta dos pedidos:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}
