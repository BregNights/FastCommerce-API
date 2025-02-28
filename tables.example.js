import { sql } from "./src/config/connect.postgres.js";

async function addTableProducts() {
  await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0
      )
    `;
  console.log("Tabela 'products' criada com sucesso!");
}
// addTableProducts()

async function addTableOrders() {
  await sql`CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`;
  console.log("Tabela 'orders' criada com sucesso!");
}
// addTableOrders()

async function addTableOrderItems() {
  await sql`CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL, -- Preço unitário no momento da compra
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)`;
  console.log("Tabela 'order_items' criada com sucesso!");
}
// addTableOrderItems()