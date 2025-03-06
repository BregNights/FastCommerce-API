import { sql } from "../config/connect.postgres.js";

export class DatabasePostgres {
  async create(user) {
    const timestamp = new Date();
    const { name, email, password } = user;

    await sql`insert into users (name, email, password, created_at) VALUES (${name}, ${email}, ${password}, ${timestamp})`;
  }

  async findByEmail(email) {
    const users = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;

    return users[0] || null;
  }

  async findById(id) {
    const users = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;

    return users[0] || null;
  }

  async update(id, user) {
    const { name, password } = user;

    await sql`update users set name = ${name}, password = ${password} WHERE id = ${id}`;
  }

  async delete(id) {
    await sql`DELETE FROM users WHERE id = ${id}`;
  }

  async registerProduct(product) {
    const { name, price, stock } = product;

    await sql`insert into products (name, price, stock) VALUES (${name}, ${price}, ${stock})`;
  }

  async getProducts({ page, limit }) {
    const offset = (page - 1) * limit;

    return await sql`SELECT * FROM products order by id limit ${limit} offset ${offset}`;
  }

  async getProductById(id) {
    const result = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;

    return result[0] || null;
  }

  async getProductPrice(productId) {
    const product =
      await sql`SELECT price FROM products WHERE id = ${productId} LIMIT 1`;

    return product[0].price || null;
  }

  async addOrder({ user_id, status }) {
    const result = await sql`
      INSERT INTO orders (user_id, status, created_at)
      VALUES (${user_id}, ${status}, NOW())
      RETURNING id
    `;

    return result[0];
  }

  async addOrderItem({ order_id, product_id, quantity, price }) {
    await sql`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (${order_id}, ${product_id}, ${quantity}, ${price})
    `;
  }

  async updateProductStock({ product_id, quantity }) {
    await sql`
    UPDATE products
    SET stock = stock - ${quantity}
    WHERE id = ${product_id}
  `;
  }

  async getOrderId(id) {
    const order =
      await sql`SELECT id FROM orders WHERE user_id = ${id} LIMIT 1`;

    return order[0] || null;
  }

  async getOrders(id) {
    const items = await sql`SELECT * FROM order_items WHERE order_id = ${id}`;
    
    return items || null;
  }
}
