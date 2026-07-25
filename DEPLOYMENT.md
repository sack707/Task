# Complete Deployment Guide

Step-by-step instructions for running **TaskPulse** locally and deploying to production environments like **Railway**.

---

## 💻 Local Setup Instructions

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **PostgreSQL** instance running locally (or remote PostgreSQL database URI)

### 2. Environment Files Setup

Create `apps/api/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public"
JWT_SECRET="super-secret-jwt-key-production-ready-2026"
JWT_EXPIRES_IN="7d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

### 3. Install & Initialize Database
```bash
# Install workspace dependencies
pnpm install

# Generate Prisma Client
pnpm db:generate

# Push schema to PostgreSQL database
pnpm db:push

# Seed initial test data
pnpm db:seed
```

### 4. Start Development Servers
```bash
pnpm dev
```
- **Frontend App**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:4000/api`
- **Swagger Documentation**: `http://localhost:4000/api/docs`

---

## 🚂 Railway Production Deployment Guide

Railway allows deploying NestJS and Next.js applications directly from Git repositories.

### Step 1: Provision Railway PostgreSQL Database
1. Log into your [Railway Dashboard](https://railway.app/).
2. Create a **New Project** and select **Provision PostgreSQL**.
3. Copy the generated `DATABASE_URL` string from the Database Variable settings.

### Step 2: Deploy Backend Service (`apps/api`)
1. In the same Railway project, select **New Service** -> **GitHub Repo**.
2. Select your monorepo repository.
3. In **Service Settings**:
   - Set **Root Directory**: `apps/api`
   - Set **Build Command**: `pnpm db:generate && pnpm build`
   - Set **Start Command**: `pnpm db:push && pnpm db:seed && pnpm start:prod`
4. In **Variables**:
   - `DATABASE_URL`: `${Postgres.DATABASE_URL}`
   - `JWT_SECRET`: `generate-a-strong-random-secret-key-32-chars`
   - `JWT_EXPIRES_IN`: `7d`
   - `PORT`: `4000`
   - `FRONTEND_URL`: `https://your-frontend-domain.up.railway.app`
5. Generate Domain (e.g. `https://your-api-domain.up.railway.app`).

### Step 3: Deploy Frontend Service (`apps/web`)
1. Add a second **GitHub Repo Service** in Railway targeting the same repository.
2. In **Service Settings**:
   - Set **Root Directory**: `apps/web`
   - Set **Build Command**: `pnpm build`
   - Set **Start Command**: `pnpm start`
3. In **Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-api-domain.up.railway.app/api`
4. Generate Domain for the frontend app.

---

## 🛠️ Troubleshooting & FAQ

### Issue 1: `PrismaClientInitializationError` / Cannot connect to DB
- **Cause**: Database server is offline or `DATABASE_URL` credentials are invalid.
- **Fix**: Verify PostgreSQL is running (`pg_isready`) and check username/password in `.env`.

### Issue 2: CORS Header Missing Error in Browser
- **Cause**: Backend `FRONTEND_URL` does not match your Next.js client origin.
- **Fix**: Update `FRONTEND_URL` in `apps/api/.env` to point to the exact frontend domain protocol and port.

### Issue 3: JWT Token Expired / HTTP 401
- **Cause**: Session expired or invalid `JWT_SECRET`.
- **Fix**: Sign out and log back in, or adjust `JWT_EXPIRES_IN="14d"`.
