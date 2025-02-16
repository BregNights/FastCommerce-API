import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'


const server = fastify()
const database = new DatabasePostgres()


server.post('/users', async (request, reply) => {
    const {name, email, password} = request.body

    await database.create ({
        name,
        email, 
        password,
    })

    return reply.status(201).send()
})

server.get('/users', async (request) => {
    const search = request.query.search

    const users = await database.list(search)
    
    return users
})

server.put('/users/:id', async (request, reply) => {
    const userId = request.params.id
    const {name, email, password} = request.body

    await database.update(userId, {
        name,
        email, 
        password,
    })
    return reply.status(204).send()
})

server.delete('/users/:id', async (request, reply) => {
    const userId = request.params.id

    await database.delete(userId)

    return reply.status(204).send()
})
    

server.listen({
    port: process.env.PORT || 3333,
})