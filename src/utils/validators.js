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
