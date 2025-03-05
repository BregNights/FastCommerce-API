import { isValidUserId, isAuthorizedUser } from "../utils/validators.js";

export async function checkUserId(request, reply) {
  try {
    const userId = request.params.id;

    const result = await isValidUserId(userId);
    if (result.error) {
      return reply.status(404).send({ message: result.error });
    }
  } catch (error) {
    console.error("Erro ao verificar ID do usuário", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}

export function checkUserParamsAndId(request, reply, done) {
  try {
    const userId = request.params.id;
    const userIdToken = request.user.id;

    const authorizedUser = isAuthorizedUser(userId, userIdToken);
    if (authorizedUser.error) {
      return reply.status(401).send({ message: authorizedUser.error });
    }
    done();
  } catch (error) {
    console.error("Erro ao verificar autorização do usuário", error);
    return reply.status(500).send({ error: "Erro interno do servidor" });
  }
}
