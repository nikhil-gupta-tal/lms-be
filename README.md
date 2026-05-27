# LMS Backend

NestJS API for a Learning Management System. Auth + user management on PostgreSQL.

**Built With:** NestJS 11, TypeScript, PostgreSQL 16, TypeORM, JWT (httpOnly cookies), Argon2.

## Prerequisites

- Node.js >= 20
- pnpm
- Docker

## Getting Started

```bash
pnpm install
pnpm run db:dev
pnpm run start:dev
```

Copy `.env.example` to `.env` and adjust if needed.

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
