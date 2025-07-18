# TL‑Backend (TodoListHub)

> **Backend API for TodoListHub** – a token‑based REST service that lets clients create, manage and share todo lists.\
> Written in **TypeScript** with **Express + Prisma (MySQL)**, JSON Web Tokens for auth and Zod for input validation.

---

## ✨ Key Features

| Area                      | Highlights                                                                        |
| ------------------------- | --------------------------------------------------------------------------------- |
| ✅ **User auth**          | Register / login with hashed passwords (bcrypt) → JWT access + refresh tokens     |
| 🗒 **Todo lists & items**  | CRUD endpoints for `/lists` & nested `/lists/:id/items`; reorder items; mark done |
| 👥 **Sharing**            | Invite another user to a list with role **viewer / editor**                       |
| 🔍 **Filtering & search** | Query params for `completed`, `dueBefore`, `q` text search                        |
| 📊 **Metrics**            | `/metrics` Prometheus endpoint + request logging via `morgan`                     |
| 🧪 **Testing**            | Jest + Supertest integration suite covers auth & todo flows                       |

---

## 🏗 Project layout

```text
.
├─ prisma/                # schema & migrations
│   └─ schema.prisma
├─ src/
│   ├─ server.ts          # Express entrypoint
│   ├─ app.ts             # sets up routes & middleware
│   ├─ routes/
│   │   ├─ auth.ts
│   │   └─ lists.ts
│   ├─ controllers/
│   ├─ middleware/
│   ├─ utils/
│   └─ types/
└─ tests/                 # integration tests
```

---

## 🚀 Quick start

### 1. Clone & install

```bash
git clone https://github.com/TodoListHub/TL-Backend.git
cd TL-Backend
npm install
```

### 2. Configure environment variables

Create a `.env` file at project root:

```ini
DATABASE_URL="mysql://user:password@localhost:3306/todolisthub"
JWT_SECRET="super-secret-key"
PORT=4000
```

> **Note:** ensure MySQL server is running and a database named `todolisthub` has been created (e.g. `CREATE DATABASE todolisthub CHARACTER SET utf8mb4;`).

### 3. Run database migrations & seed

```bash
npx prisma migrate deploy   # or prisma migrate dev --name init
npx prisma db seed          # optional seed
```

### 4. Start the dev server

```bash
npm run dev   # nodemon + ts-node
```

Server listens on [**http://localhost:4000**](http://localhost:4000) by default.

### 5. Run tests

```bash
npm test
```

---

## 🔌 REST API overview

```http
POST   /auth/register            { email, password }
POST   /auth/login               { email, password }  →  { access, refresh }
POST   /auth/refresh             { refresh }

GET    /lists                    →  all lists for user
POST   /lists                    { title }
GET    /lists/:id
PATCH  /lists/:id                { title }
DELETE /lists/:id

POST   /lists/:id/invite         { email, role }

POST   /lists/:id/items          { text, dueDate }
PATCH  /lists/:id/items/:itemId  { text, completed }
DELETE /lists/:id/items/:itemId
```

_(All routes require **`Authorization: Bearer <token>`** except \*\*`/auth/_`\*_)_

---

## 📦 NPM scripts

| Script   | Action                                   |
| -------- | ---------------------------------------- |
| `dev`    | Run ts‑node with Nodemon (src/server.ts) |
| `build`  | Compile to `dist/` via `tsc`             |
| `start`  | `node dist/server.js` – production mode  |
| `test`   | Jest + Supertest                         |
| `prisma` | Shortcut to `prisma` CLI                 |

---

## 🛡 License

MIT © TodoListHub
