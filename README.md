# LMS Backend

NestJS API for a Learning Management System. Auth + user management on PostgreSQL.

**Built With:** NestJS 11, TypeScript, PostgreSQL 16, TypeORM, JWT (httpOnly cookies), Argon2.

## Prerequisites

- Node.js >= 20
- pnpm
- Docker

## Development Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL and Adminer
pnpm run db:dev

# 3. Configure environment
cp .env.example .env

# 4. Start dev server with watch mode
pnpm run start:dev
```

Dev server runs at `http://localhost:3000`.

## Production (Docker)

Build and run the production image with Docker Compose. `DB_HOST=db` is set automatically in docker-compose.yml — credentials come from `.env.production.local`.

```bash
# 1. Set production environment variables
cp .env.example .env.production.local
# Edit .env.production.local — use a strong JWT_SECRET, set NODE_ENV=production

# 2. Build and start
docker compose build
docker compose up -d

# 3. Smoke test — health, register, profile
curl http://localhost:3000/api/health

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test1234!"}' \
  -c cookies.txt

curl http://localhost:3000/api/users/profile -b cookies.txt

rm cookies.txt

# 4. Tail logs
docker compose logs -f

# 5. Stop
docker compose down
```

## Scripts

| Script | Description |
|---|---|
| `db:dev` | Start PostgreSQL + Adminer |
| `start:dev` | Dev server with watch |
| `start:prod` | Production start |
| `test` | Unit tests |
| `test:e2e` | End-to-end tests |
| `db:mig:run` | Run migrations |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Clear session |
| GET | `/api/users/profile` | Yes | Get own profile |
| PATCH | `/api/users/profile` | Yes | Update name/email |
| POST | `/api/users/change-password` | Yes | Change password |

See `rest.http` for runnable examples.
