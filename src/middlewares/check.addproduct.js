export function checkAddProduct(request, reply, done) {
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

    done();
  } catch (error) {
    console.error(
      "Erro ao verificar checagens para adição de novo produto",
      error
    );
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}
