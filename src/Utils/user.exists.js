import { database } from "../controllers/user.controller.js";

export async function isValidUser(request) {
  const userId = request.user.id;
  const user = await database.findById(userId);
  if (!user) {
    return { error: "Usuário não encontrado" };
  }
  return user
}
