import { database } from "../controllers/user.controller.js";
import bcrypt from "bcryptjs";

export async function authenticateUser(email, password) {
  const user = await database.findByEmail(email);
  if (!user) {
    return { error: "E-mail ou senha inválidos  (email)" };
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return { error: "E-mail ou senha inválidos  (senha)" };
  }

  return user;
}

