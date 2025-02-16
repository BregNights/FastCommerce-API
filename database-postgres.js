import { sql } from './db-connect.js'

export class DatabasePostgres {
    async create(user) {
        const timestamp = new Date
        const { name, email, password } = user
        await sql `insert into users (name, email, password, created_at) VALUES (${name}, ${email}, ${password}, ${timestamp})`
    }

    async list(search) {
        let users

        if (search) {
            users = await sql`select * from users WHERE name ilike ${'%' + search + '%'}`
        } else {
            users = await sql`select * from users`
        }

        return users
    }

    async update(id, user) {
        const { name, email, password } = user
        await sql`update users set name = ${name}, email = ${email}, password = ${password} WHERE id = ${id}`
    }

    async delete (id) {
        await sql`DELETE FROM users WHERE id = ${id}`
    }
}