# Users Node API

Este é um projeto de API RESTful desenvolvido com **Node.js** utilizando o framework **Fastify** e banco de dados **PostgreSQL**. A API permite a criação, leitura, atualização e exclusão (CRUD) de usuários, além de contar com autenticação e autorização via JWT.

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Fastify**
- **PostgreSQL**
- **jsonwebtoken (JWT)**
- **bcryptjs**
- **dotenv**

## 📌 Funcionalidades

- Cadastro de usuários com senha criptografada.
- Autenticação via JWT.
- Operações CRUD para gerenciamento de usuários.
- Validações e segurança com Fastify.

## 📦 Instalação

1. Clone este repositório:
   ```sh
   git clone https://github.com/BregNights/users-node-api.git
   ```

2. Acesse a pasta do projeto:
   ```sh
   cd users-node-api
   ```

3. Instale as dependências:
   ```sh
   npm install
   ```

4. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env` e preencha com suas configurações.

5. Inicie o servidor:
   ```sh
   npm run dev
   ```

## 🛠 Endpoints

### 🔑 Autenticação
- `POST /register` - Criação de novo usuário.
- `POST /login` - Login e obtenção de token JWT.

### 👤 Usuários
- `GET /users` - Listar todos os usuários (Requer autenticação).
- `PUT /users/:id` - Atualizar um usuário (Requer autenticação e permissão).
- `DELETE /users/:id` - Excluir um usuário (Requer autenticação e permissão).

### 🛒 Produtos

- `POST /addproduct` - Adicionar um novo produto (Requer autenticação e permissão).
- `GET /getproducts` - Listar todos os produtos.

### 📦 Pedidos

- `POST /addorder` - Criar um novo pedido (Requer autenticação e permissão).
- `GET /orders` - Listar os pedidos do usuário autenticado (Requer autenticação e permissão).

### 🛡 Segurança

- As senhas são armazenadas de forma segura utilizando bcrypt.
- Tokens JWT são utilizados para autenticação e proteção dos endpoints.