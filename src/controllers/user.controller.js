import { DatabasePostgres } from "../database/queries.postgres.js";
import bcrypt from "bcryptjs";
import { authenticateUser } from "../services/auth.service.user.js";
import { generateToken } from "../utils/generate.jwt.js";
import { isValidUserId } from "../utils/validators.js";

export const database = new DatabasePostgres();

export async function registerUser(request, reply) {
  try {
    const { name, email, password } = request.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    await database.create({
      name,
      email,
      password: hashedPassword,
    });

    return reply.status(201).send({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function loginUser(request, reply) {
  try {
    const { email, password } = request.body;

    const result = await authenticateUser(email, password);

    if (result.error) {
      return reply.status(401).send({ message: result.error });
    }

    const token = generateToken(result);

    return reply.status(200).send({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function getUser(request, reply) {
  try {
    const userId = request.user.id;
    const result = await isValidUserId(userId);
    if (result.error) {
      return reply.status(404).send({ message: result.error });
    }

    const user = {
      id: result.id,
      name: result.name,
      email: result.email,
    };

    return reply.status(200).send(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export async function updateUser(request, reply) {
  try {
    const userId = request.params.id;
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

    await database.delete(userId);
    return reply.status(200).send({ message: "Usuário Excluido com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}
