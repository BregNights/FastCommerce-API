import { DatabasePostgres } from "../database/queries.postgres.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const database = new DatabasePostgres();

export async function registerUser(request, reply) {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return reply.status(400).send({
        message: "Todos os campos são obrigatórios: name, email e password",
      });
    }

    const userEmail = await database.findByEmail(email);
    if (userEmail) {
      return reply.status(409).send({
        message:
          "O e-mail informado já está cadastrado. Por favor, utilize outro ou recupere sua senha.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await database.create({
      name,
      email,
      password: hashedPassword,
    });

    return reply.status(201).send({
      message: "Usuário criado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function loginUser(request, reply) {
  try {
    const { email, password } = request.body;
    const user = await database.findByEmail(email);
    if (!user) {
      return reply.status(401).send({ message: "E-mail ou senha inválidos" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ message: "E-mail ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );

    return reply.status(200).send({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function getUser(request, reply) {
  try {
    const userIdToken = request.user.id;
    const user = await database.findById(userIdToken);

    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado" });
    }

    return reply.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function editUser(request, reply) {
  try {
    const userId = request.params.id;

    const existsId = await database.findById(userId);
    if (!existsId) {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    const userIdToken = request.user.id;
    if (String(userIdToken) !== String(userId)) {
      return reply.status(400).send({
        error: "Ação não permitida: você só pode excluir sua própria conta.",
      });
    }

    const { name, password } = request.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    await database.update(userId, {
      name,
      password: hashedPassword,
    });

    return reply.status(200).send({ message: "Usuário editado com sucesso!" });
  } catch (error) {
    console.error("Erro ao editar usuário:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function deleteUser(request, reply) {
  try {
    const userId = request.params.id;

    const existsId = await database.findById(userId);
    if (!existsId) {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    const userIdToken = request.user.id;
    if (String(userIdToken) !== String(userId)) {
      return reply.status(400).send({
        error: "Ação não permitida: você só pode excluir sua própria conta.",
      });
    }

    await database.delete(userId);
    return reply.status(200).send({ message: "Usuário Excluido com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}
