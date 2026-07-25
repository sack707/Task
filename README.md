# TaskPulse - Team Task Management Platform (Full Stack Monorepo)

A production-ready, full-stack monorepo web application engineered for high-performance team task tracking, project workspace management, and operational analytics with strict Role-Based Access Control (RBAC).

Built with **Next.js 15**, **NestJS**, **Prisma ORM**, **PostgreSQL**, **JWT Authentication**, and **TailwindCSS**.

---

## 🎨 Visual Overview & Interface

TaskPulse features a dark glassmorphism design system inspired by Linear, Stripe, and Vercel:

- **Dashboard**: Live telemetry for Total Projects, Total Tasks, Completed Tasks, Pending Tasks, and Overdue Tasks alongside recent activity feeds.
- **Projects Workspace**: Project list cards, progress bars, member ownership, and modal dialogs for project creation and editing.
- **Tasks Registry**: Multi-criteria search, status filtering, priority badges, sorting options, and inline status toggles.
- **Team Directory**: Workload breakdown and role assignment tables.

---

## ✨ Features

- **Role-Based Access Control (RBAC)**:
  - **ADMIN**: Create, edit, and delete projects; create, assign, update, and delete tasks; manage team members; view full system telemetry.
  - **MEMBER**: View assigned projects, view assigned tasks, update task execution status (`TODO` ➔ `IN_PROGRESS` ➔ `DONE`).
- **Security Architecture**:
  - Passport JWT Authentication with Bearer headers.
  - Password hashing via `bcrypt`.
  - Helmet HTTP security headers, CORS enablement, and global exception filter payloads.
- **Analytics & Telemetry**: Aggregated operational counts for total, completed, pending, and overdue tasks.
- **Interactive UI**: Responsive desktop, tablet, and mobile layouts built with TailwindCSS, dark theme accents, skeleton loaders, and toast notifications.

---

## 🛠️ Tech Stack

### Monorepo Architecture
- **Package Manager**: `pnpm` workspaces (`apps/api` and `apps/web`)

### Backend (`apps/api`)
- **Framework**: NestJS 10 (TypeScript)
- **Database ORM**: Prisma ORM with PostgreSQL
- **Security**: Passport JWT, bcrypt password hashing, Helmet headers, CORS policies
- **Validation**: Class Validator (`class-validator`) & Class Transformer (`class-transformer`)
- **API Documentation**: OpenAPI / Swagger UI at `/api/docs`

### Frontend (`apps/web`)
- **Framework**: Next.js 15 App Router
- **State Management & Caching**: TanStack Query (React Query v5)
- **Form Management**: React Hook Form + Zod schema validation
- **HTTP Client**: Axios with JWT Bearer request interceptor & 401 redirect handling
- **Styling**: TailwindCSS, Lucide React Icons, custom glassmorphism design tokens

---

## 🏗️ Folder Structure

```
Tasks/
├── apps/
│   ├── api/                 # NestJS Backend Application
│   │   ├── prisma/          # Prisma Database Schema & Seed Script
│   │   └── src/
│   │       ├── common/      # Guards, Decorators, Filters, Interceptors
│   │       ├── config/      # Environment Configuration Loader
│   │       ├── database/    # Prisma Service & Connection
│   │       └── modules/     # Auth, Users, Projects, Tasks, Dashboard Modules
│   └── web/                 # Next.js 15 Frontend Application
│       └── src/
│           ├── app/         # Next.js App Router Pages (Login, Dashboard, Projects, Tasks, etc.)
│           ├── components/  # UI Components, Modals, Badges, Layouts
│           ├── hooks/       # Custom React Hooks
│           ├── lib/         # Axios API Client & Interceptors
│           ├── providers/   # TanStack Query & Auth Providers
│           └── types/       # TypeScript Interface Definitions
├── SYSTEM_DESIGN.md         # System Architecture & Diagrams
├── API_REFERENCE.md         # Complete REST API Specifications
├── DATABASE.md              # Entity Relationship Diagram & Schema Dictionary
├── DEPLOYMENT.md            # Railway & Local Deployment Guide
├── CONTRIBUTING.md          # Developer Contribution Guidelines
├── LICENSE                  # MIT License
├── package.json
└── pnpm-workspace.yaml
```

---

## 🔑 Test Demo Credentials

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@example.com` | `Password123!` | Full CRUD on Projects & Tasks, Member Management, Global Analytics |
| **MEMBER** | `sarah@example.com` | `Password123!` | View assigned projects & tasks, Update task status |
| **MEMBER** | `john@example.com` | `Password123!` | View assigned projects & tasks, Update task status |

---

## ⚡ Setup & Local Execution

### 1. Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL database instance

### 2. Quick Start Commands

```bash
# Clone & install dependencies
pnpm install

# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed sample data (1 Admin, 2 Members, 3 Projects, 10 Tasks)
pnpm db:seed

# Start development environment
pnpm dev
```

- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000/api`
- **Swagger Docs**: `http://localhost:4000/api/docs`

---

## 📚 Documentation & API Link

Detailed documentation guides are available in the repository root:

- 📐 [System Design & Architecture Diagram](SYSTEM_DESIGN.md)
- 📖 [Complete API Reference Manual](API_REFERENCE.md)
- 🗄️ [Database ER Diagram & Dictionary](DATABASE.md)
- 🚂 [Railway & Production Deployment Guide](DEPLOYMENT.md)

---

## 🚀 Deployment Links

- **API Documentation (Swagger)**: `http://localhost:4000/api/docs`
- **Production Deployment Configuration**: Prepared for Railway using `railway.json` and `Procfile`.

---

## 🔮 Future Improvements

1. **Subtasks & Comments**: Nested task checklists and comment threads per task.
2. **Real-Time WebSockets**: Instant status update broadcasts using NestJS WebSockets (`socket.io`).
3. **File Attachments**: AWS S3 integration for task asset attachments.
