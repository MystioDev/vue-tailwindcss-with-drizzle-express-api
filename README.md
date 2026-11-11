# Full-Stack Starter Template: Vue 3 + Tailwind CSS + Express + Drizzle ORM + MySQL

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vue 3](https://img.shields.io/badge/vue-3.5%2B-42b883.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/vite-6.x-646cff.svg)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/express-5.x-blue.svg)](https://expressjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/drizzle--orm-0.45%2B-C5F74F.svg)](https://orm.drizzle.team/)
[![MySQL](https://img.shields.io/badge/mysql-8.x-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/docker-compose-2496ED.svg)](https://www.docker.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

A unified, production-ready full-stack web application template combining a modern **Vue 3** + **Tailwind CSS v4** frontend with an **Express 5** REST API, **Drizzle ORM**, and a **MySQL** database.

Designed from the ground up with a **shared root `.env` configuration**, **bidirectional port synchronization** (frontend dev proxy automatically pairs with backend API port; backend CORS automatically authorizes frontend port), and an **optional 1-command Docker Compose setup**.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture & Folder Structure](#-architecture--folder-structure)
- [Shared `.env` & Bidirectional Port Pairing](#-shared-env--bidirectional-port-pairing)
- [Quick Start: Local Development](#-quick-start-local-development)
- [Database Management with Drizzle ORM](#-database-management-with-drizzle-orm)
- [REST API Reference](#-rest-api-reference)
- [Frontend Development (Vue 3 + Tailwind v4)](#-frontend-development-vue-3--tailwind-v4)
- [Docker Compose Setup (Optional Containerization)](#-docker-compose-setup-optional-containerization)
- [NPM Scripts Reference](#-npm-scripts-reference)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## ✨ Key Features

- **Frontend (Vue 3.5+ & Vite 6):** Vue's classic, beginner-friendly **Options API** (`data`, `methods`, `computed`, `mounted`, `props`), Single-File Components, instant Hot Module Replacement (HMR), and fast production bundling.
- **Tailwind CSS v4:** Zero-config CSS-first architecture powered by `@tailwindcss/vite`, supporting both dark and light modes out of the box.
- **Backend (Express 5):** Express 5 REST API with robust JSON parsing, health check endpoints, modular routing, and error handling.
- **Drizzle ORM & MySQL 8:** Type-safe database queries and schema definitions, fast connection pooling via `mysql2`, automatic schema syncing (`db:push`), migration tooling (`db:generate` & `db:migrate`), and visual database management with **Drizzle Studio**.
- **Shared `.env` Configuration:** A single `.env` file at the root repository level configures the frontend, backend, database credentials, and container environments with zero configuration drift.
- **Bidirectional Port Synchronization:**
  - Frontend Vite dev proxy routes `/api` requests dynamically to `BACKEND_PORT`.
  - Express backend CORS whitelist dynamically authorizes requests from `FRONTEND_PORT`.
- **Optional Docker Compose Setup:** Launch the entire stack (MySQL 8, Express API, and Nginx Vue SPA) or just the MySQL database service with a single command.
- **Interactive Full-Stack Demo:** Includes a pre-built user CRUD component (`UserManager.vue`) demonstrating live API calls, real-time connectivity diagnostics, validation, and database persistence.

---

## 🏛️ Architecture & Folder Structure

```
vue-tailwindcss-with-drizzle-express-api/
├── .env.example              # Central environment template for the entire stack
├── .env                      # Shared environment configuration (ignored by git)
├── .gitignore                # Top-level git ignore rules
├── .dockerignore             # Docker build exclusions
├── docker-compose.yml        # Multi-container orchestration (MySQL, backend, frontend)
├── package.json              # Root npm workspace scripts (dev, build, db, docker)
├── scripts/
│   └── dev.js                # Cross-platform concurrent dev runner (zero external dependencies)
├── backend/                  # Express 5 REST API + Drizzle ORM
│   ├── .dockerignore         # Backend Docker ignore rules
│   ├── Dockerfile            # Production Node.js Alpine container
│   ├── drizzle.config.js     # Drizzle Kit configuration (loads root .env)
│   ├── package.json          # Backend dependencies & scripts
│   ├── drizzle/              # Generated SQL migrations & meta snapshots
│   │   ├── 0000_military_jimmy_woo.sql
│   │   └── meta/
│   └── src/
│       ├── index.js          # Express server entry point, CORS & health checks
│       ├── db/
│       │   ├── db.js         # MySQL2 pool & Drizzle ORM client initialization
│       │   └── schema.js     # Drizzle schema definitions (e.g. users table)
│       └── routes/
│           └── users.js      # Full CRUD REST API endpoints for users
└── frontend/                 # Vue 3 + Tailwind CSS v4 Single Page App
    ├── .dockerignore         # Frontend Docker ignore rules
    ├── Dockerfile            # Multi-stage production container (Node build -> Nginx Alpine)
    ├── nginx.conf            # Nginx config with SPA routing & reverse proxy for /api
    ├── index.html            # Vite HTML template entry point
    ├── package.json          # Frontend dependencies & scripts
    ├── vite.config.js        # Vite config (loads root .env, sets port & /api proxy)
    ├── public/
    │   └── favicon.svg       # Application logo / favicon
    └── src/
        ├── main.js           # Vue application entry point
        ├── App.vue           # Main application root layout & feature highlights
        ├── style.css         # Tailwind CSS v4 entry point (@import "tailwindcss";)
        └── components/
            ├── HelloWorld.vue    # Full-stack hero component with reactive counter
            └── UserManager.vue   # Live full-stack CRUD demo & port diagnostic UI
```

---

## 🔄 Shared `.env` & Bidirectional Port Pairing

Both the frontend and backend read from a **single root `.env` file**. You only need to define your ports and database credentials once.

### How Bidirectional Port Synchronization Works

1. **Frontend Accepts Backend Port (`BACKEND_PORT`):**
   - In `frontend/vite.config.js`, Vite loads `BACKEND_PORT` (default: `3000`) from the root `.env`.
   - Vite configures its internal dev proxy so that any request sent to `/api/*` on the frontend dev server is forwarded directly to `http://localhost:${BACKEND_PORT}`.
   - Frontend components can call relative URLs (e.g. `fetch('/api/users')`) or use `import.meta.env.VITE_API_URL`.

2. **Backend Accepts Frontend Port (`FRONTEND_PORT`):**
   - In `backend/src/index.js`, Express loads `FRONTEND_PORT` (default: `5173`) from the root `.env`.
   - Express configures its Cross-Origin Resource Sharing (CORS) whitelist to allow requests from `http://localhost:${FRONTEND_PORT}` and `http://127.0.0.1:${FRONTEND_PORT}`.

Changing `BACKEND_PORT=4000` and `FRONTEND_PORT=8080` in `.env` automatically aligns both sides without modifying a single line of application code!

### Environment Variables Reference

| Variable | Default Value | Description |
|---|---|---|
| `BACKEND_PORT` / `PORT` | `3000` | Port where the Express API server listens |
| `FRONTEND_PORT` | `5173` | Port where Vite dev server runs or host port for frontend container |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin for backend requests |
| `VITE_API_URL` | `http://localhost:3000` | Backend API URL injected into frontend client |
| `DB_HOST` | `localhost` | MySQL host (`localhost` for local dev, `mysql` in Docker network) |
| `DB_PORT` | `3306` | MySQL port on the host machine |
| `DB_USER` | `root` | MySQL database user |
| `DB_PASSWORD` | `password` | MySQL database password |
| `DB_NAME` | `express_drizzle_db` | MySQL database name |
| `DATABASE_URL` | `mysql://root:password@localhost:3306/express_drizzle_db` | Full connection URI used by Drizzle ORM and Drizzle Kit |

---

## 🚀 Quick Start: Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (`>= 18.0.0`, Node 20+ or 22+ recommended)
- [npm](https://www.npmjs.com/) (`>= 7.0.0`, included with Node.js)
- A running [MySQL](https://www.mysql.com/) instance (local server or via Docker)

---

### Step-by-Step Installation

#### 1. Configure Environment Variables

Copy the template environment file to `.env`:

```bash
cp .env.example .env
```

If needed, open `.env` and adjust your ports or MySQL credentials.

#### 2. Install Dependencies

Install all dependencies across the root, backend, and frontend with one command:

```bash
npm install
```

#### 3. Start MySQL Database

You can use an existing local MySQL server, or start a containerized MySQL instance instantly using Docker:

```bash
npm run docker:db
```

*(This runs `docker compose up -d mysql` using the credentials in your `.env`.)*

#### 4. Push Database Schema (Drizzle ORM)

Synchronize the database schema to your MySQL instance:

```bash
npm run db:push
```

#### 5. Start Frontend and Backend Concurrently

Run both the Express API and Vite frontend dev servers together:

```bash
npm run dev
```

Open your browser to:
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Backend Users Endpoint:** [http://localhost:3000/api/users](http://localhost:3000/api/users)

---

## 🗄️ Database Management with Drizzle ORM

All database schema definitions reside in [`backend/src/db/schema.js`](backend/src/db/schema.js).

### Recommended Commands

- **Push Schema Changes (Fast Prototyping):**
  Sync your JavaScript schema directly to MySQL without creating migration files:
  ```bash
  npm run db:push
  ```

- **Generate SQL Migrations (Production-Ready):**
  Generate versioned SQL migration scripts based on schema diffs:
  ```bash
  npm run db:generate
  ```

- **Apply Migrations:**
  Execute pending SQL migrations against your database:
  ```bash
  npm run db:migrate
  ```

- **Launch Drizzle Studio (Visual Database GUI):**
  Inspect, search, and edit database records in a browser GUI:
  ```bash
  npm run db:studio
  ```

---

## 🌐 REST API Reference

The Express backend exposes the following REST endpoints:

### Endpoints

| Method | Endpoint | Description | Request Body Example |
|---|---|---|---|
| `GET` | `/api/health` | Health diagnostic check (uptime, ports, timestamp) | None |
| `GET` | `/api/users` | Retrieve all users | None |
| `GET` | `/api/users/:id` | Retrieve a single user by ID | None |
| `POST` | `/api/users` | Create a new user | `{"name": "Alice", "email": "alice@example.com"}` |
| `PUT` | `/api/users/:id` | Update an existing user | `{"name": "Alice Cooper", "email": "alice.cooper@example.com"}` |
| `DELETE`| `/api/users/:id` | Delete a user by ID | None |

### Example API Requests

#### Check API Health
```bash
curl http://localhost:3000/api/health
```

#### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

#### Fetch All Users
```bash
curl http://localhost:3000/api/users
```

---

## 🎨 Frontend Development (Vue 3 + Tailwind v4)

- **Vue Single-File Components:** Components are built with Vue's classic, structured **Options API** (`data`, `methods`, `computed`, `mounted`, `props`) for clear separation of concerns, high readability, and beginner-friendly state management.
- **Tailwind CSS v4:** Zero-config CSS setup configured directly in [`frontend/src/style.css`](frontend/src/style.css):
  ```css
  @import "tailwindcss";
  ```
- **Live CRUD Demo (`frontend/src/components/UserManager.vue`):**
  - Performs health check checks on mount.
  - Automatically fetches existing users from `/api/users`.
  - Supports creating, editing, and deleting users with real-time UI updates.
  - Displays the active port pairing and error diagnostic messages if MySQL is offline.

---

## 🐳 Docker Compose Setup (Optional Containerization)

This template includes a ready-to-run, production-grade Docker Compose architecture with 3 services:

1. **`mysql`**: Official MySQL 8.0 image with persistent volume storage (`mysql_data`) and health check ping.
2. **`backend`**: Node 20 Alpine container running the Express API, connected to MySQL within the container network.
3. **`frontend`**: Multi-stage build producing static assets served by Nginx Alpine, with reverse proxying for `/api` requests.

### 1. Run the Entire Full-Stack Application in Docker

```bash
# Build and start all 3 containers in the background
npm run docker:up
# or: docker compose up -d --build
```

Access the containerized application at:
- **Frontend App:** [http://localhost:5173](http://localhost:5173) (or your configured `FRONTEND_PORT`)
- **Backend API:** [http://localhost:3000](http://localhost:3000) (or your configured `BACKEND_PORT`)

### 2. Run Database Commands While Using Docker Compose

When running the full Docker Compose stack (`npm run docker:up`), you have two simple ways to run Drizzle database commands:

#### Option A: Simple One-Line Docker Scripts (Runs inside the backend container)
```bash
# Push schema directly to the containerized database
npm run docker:db:push

# Run pending SQL migrations inside Docker
npm run docker:db:migrate

# Generate new migration files inside Docker
npm run docker:db:generate

# Check schema and migrations inside Docker
npm run docker:db:check

# Open an interactive shell inside the backend container
npm run docker:sh
```

#### Option B: Direct Host Commands (Connects via exposed MySQL port)
Because `docker-compose.yml` maps `${DB_PORT}:3306` to `localhost:3306`, your host Drizzle commands also work seamlessly against the Docker database:
```bash
npm run db:push
npm run db:migrate
npm run db:studio   # Opens Drizzle Studio in your host web browser!
```

### 3. Useful Docker Commands

```bash
# View live streaming logs from all containers
npm run docker:logs
# or: docker compose logs -f

# Stop all containers
npm run docker:down
# or: docker compose down

# Start ONLY the MySQL database (for local npm run dev workflows)
npm run docker:db
# or: docker compose up -d mysql
```

---

## 📜 NPM Scripts Reference

You can execute all commands directly from the root project folder:

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `node scripts/dev.js` | Concurrently runs backend nodemon and frontend Vite dev servers |
| `npm run dev:backend` | `npm run dev --workspace=backend` | Runs only the Express API in dev mode with reload |
| `npm run dev:frontend` | `npm run dev --workspace=frontend` | Runs only the Vite frontend dev server |
| `npm run build` | `npm run build --workspace=frontend` | Builds the frontend for production into `frontend/dist` |
| `npm run start` | `npm run start --workspace=backend` | Starts the Express API in standard production mode |
| `npm run db:push` | `npm run db:push --workspace=backend` | Syncs schema changes directly to MySQL database (host) |
| `npm run db:generate` | `npm run db:generate --workspace=backend` | Generates SQL migration files from schema (host) |
| `npm run db:migrate` | `npm run db:migrate --workspace=backend` | Applies pending SQL migrations (host) |
| `npm run db:studio` | `npm run db:studio --workspace=backend` | Starts visual Drizzle Studio database UI (host) |
| `npm run db:check` | `npm run db:check --workspace=backend` | Validates Drizzle migrations against schema (host) |
| `npm run docker:up` | `docker compose up -d --build` | Builds & starts all services containerized |
| `npm run docker:down`| `docker compose down` | Stops and tears down containerized services |
| `npm run docker:logs`| `docker compose logs -f` | Streams output logs from Docker containers |
| `npm run docker:db`  | `docker compose up -d mysql` | Starts only MySQL container for local development |
| `npm run docker:db:push` | `docker compose exec backend npm run db:push` | Pushes schema to MySQL inside Docker Compose |
| `npm run docker:db:migrate` | `docker compose exec backend npm run db:migrate` | Applies migrations to MySQL inside Docker Compose |
| `npm run docker:db:generate`| `docker compose exec backend npm run db:generate` | Generates migrations inside Docker Compose |
| `npm run docker:db:check`   | `docker compose exec backend npm run db:check` | Validates schema inside Docker Compose |
| `npm run docker:sh`  | `docker compose exec backend sh` | Opens interactive shell inside backend container |

---

## ❓ Troubleshooting & FAQ

### 1. Database Connection Refused (`ECONNREFUSED 127.0.0.1:3306`)
- Ensure MySQL is running. If using Docker, run `npm run docker:db`.
- Check that the `DB_PASSWORD`, `DB_PORT`, and `DB_USER` in `.env` match your MySQL instance credentials.

### 2. Port Already in Use (`EADDRINUSE`)
- If port `3000` or `5173` is occupied by another process, simply edit `.env`:
  ```env
  BACKEND_PORT=3001
  FRONTEND_PORT=5174
  ```
- Restart the servers (`npm run dev`). The Vite dev proxy and Express CORS will automatically rebind to the new ports.

### 3. CORS Error in Browser Console
- The backend automatically permits `http://localhost:${FRONTEND_PORT}` and `http://127.0.0.1:${FRONTEND_PORT}`.
- If you access the frontend using a custom domain or IP (e.g. `http://192.168.1.50:5173`), set `CORS_ORIGIN=http://192.168.1.50:5173` or `CORS_ORIGIN=*` in `.env`.

### 4. Running Backend and Frontend in Separate Terminals
If you prefer running services in separate terminal tabs instead of `npm run dev`:
- **Terminal 1 (Backend):**
  ```bash
  cd backend && npm run dev
  ```
- **Terminal 2 (Frontend):**
  ```bash
  cd frontend && npm run dev
  ```

---

## 📄 License

This template is open-source and released under the [ISC License](LICENSE). Customize and adapt it freely for your personal and commercial projects!

