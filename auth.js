import jwt from 'jsonwebtoken';
import { secretjwt } from './key-jwt.js'

export function verifyToken(request, reply, done) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.status(401).send({ error: "Token não fornecido" });
        }

        const token = authHeader.split(" ")[1]
        const secret = secretjwt

       
        const decoded = jwt.verify(token, secret);
        request.user = decoded

        done()
    } catch (error) {
        return reply.status(401).send({ error: "Token inválido ou expirado" });
    }
}