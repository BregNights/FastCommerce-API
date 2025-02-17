import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { secretjwt } from './key-jwt.js'
import { verifyToken } from './auth.js'



const server = fastify()
const database = new DatabasePostgres()


server.post('/api/register', async (request, reply) => {
    try {
        const { name, email, password } = request.body

        if (!name || !email || !password) {
            return reply.status(200).send({ error: "Todos os campos são obrigatórios: name, email e password" })
        }

        const hashedPassword = bcrypt.hashSync(password, 10)

        await database.create({
            name,
            email,
            password: hashedPassword,
        })

        return reply.status(201).send({ message: "Usuário criado com sucesso!" })
    } catch (error) {
        console.error("Erro ao registrar usuário:", error)
        return reply.status(500).send({ error: "Erro interno do servidor" })
    }


})

server.post('/api/login', async (request, reply) => {
    try {
        const { email, password } = request.body

        const user = await database.findByEmail(email)
        if (!user) {
            return reply.status(401).send({ error: "E-mail ou senha inválidos" })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return reply.status(401).send({ error: "E-mail ou senha inválidos" })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email }, secretjwt, { expiresIn: '1h' }
        )

        return reply.status(200).send({ token })
    } catch (error) {
        console.error("Erro ao fazer login:", error)
        return reply.status(500).send({ error: "Erro interno do servidor" })
    }
})


server.get('/api', { preHandler: verifyToken }, async (request, reply) => {
    try {
        const search = request.query.search
        const users = await database.list(search)
        return reply.status(200).send(users)
    } catch (error) {
        console.error("Erro ao listar usuários:", error)
        return reply.status(500).send({ error: "Erro interno do servidor" })
    }
})

server.put('/api/:id', { preHandler: verifyToken }, async (request, reply) => {
    try {
        const userId = request.params.id
        const { name, email, password } = request.body
        const hashedPassword = bcrypt.hashSync(password, 10)

        await database.update(userId, {
            name,
            email,
            password: hashedPassword,
        })

        return reply.status(204).send({ message: "Usuário editado com sucesso!" })
    } catch (error) {
        console.error("Erro ao editar usuário:", error)
        return reply.status(500).send({ error: "Erro interno do servidor" })
    }

})

server.delete('/api/:id', { preHandler: verifyToken }, async (request, reply) => {
    try {
        const userId = request.params.id
        const existsId = await database.findById(userId)

        if (!existsId) {
            return reply.status(404).send({ error: "Usuário não encontrado" })
        }

        await database.delete(userId)
        return reply.status(204).send({ message: "Usuário Excluido com sucesso!" })

    } catch (error) {
        console.error("Erro ao excluir usuário:", error)
        return reply.status(500).send({ error: "Erro interno do servidor" })
    }
})


server.listen({
    port: process.env.PORT || 3333,
})