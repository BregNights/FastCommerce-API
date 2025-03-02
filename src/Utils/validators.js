import { database } from "../controllers/user.controller.js";

export async function isValidEmail(request, reply) {
  const { email } = request.body;
  const existingEmail = await database.findByEmail(email);
  if (existingEmail) {
    return reply.status(409).send({
      message:
        "O e-mail informado já está cadastrado. Por favor, utilize outro ou recupere sua senha.",
    });
  }
  return true;
}
