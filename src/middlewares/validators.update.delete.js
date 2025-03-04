import { isValidUserId, isAuthorizedUser } from "../utils/validators.js";

export async function verifyUserId (request, reply) {
    const userId = request.params.id;

    const result = await isValidUserId(userId);
    if (result.error) {
      return reply.status(404).send({ message: result.error });
    }
    const userIdToken = request.user.id;

    const authorizedUser = isAuthorizedUser(userId, userIdToken);
    if (authorizedUser.error) {
      return reply.status(401).send({ message: authorizedUser.error });
    }
}


    