import "dotenv/config";
import jwt from "jsonwebtoken";

export function verifyToken(request, reply, done) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ message: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWTKEY;

    const decoded = jwt.verify(token, secret);
    request.user = decoded;

    done();
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido ou expirado" });
  }
}
