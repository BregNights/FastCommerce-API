import { database } from "../controllers/user.controller.js";

export async function addProduct(request, reply) {
  try {
    const { name, price, stock } = request.body;
    if (!name || price == null || stock == null) {
      return reply
        .status(400)
        .send({ message: "Todos os campos são obrigatórios" });
    }

    if (typeof price !== "number" || price <= 0) {
      return reply.status(400).send({ message: "Preço inválido" });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return reply.status(400).send({ message: "Estoque inválido" });
    }

    await database.registerProduct({
      name,
      price,
      stock,
    });

    return reply.status(201).send({
      message: "Produto adicionado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function getProducts(request, reply) {
  try {
    const maxLimit = 100;
    const { page = 1, limit = 10 } = request.query;
    const products = await database.getProducts({
      page: parseInt(page),
      limit: Math.min(parseInt(limit), maxLimit),
    });
    return reply.status(200).send({
      products,
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}
