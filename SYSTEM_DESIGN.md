# System Design & Architecture Specification

Detailed architectural specifications, execution flow diagrams, authentication mechanisms, and deployment topology for **TaskPulse (Team Task Manager)**.

---

## 1. High-Level Architecture

The system is designed as a modular monorepo using **`pnpm` workspaces**. The backend API is built on NestJS following Clean Architecture principles (Controllers -> Services -> Prisma Repository -> PostgreSQL), while the frontend is a Next.js 15 App Router application providing dynamic server and client components.

```mermaid
graph TD
    Client["Client Browser (Next.js 15 UI)"]
    API["NestJS API Server (Port 4000)"]
    DB[(PostgreSQL Database)]
    
    Client -->|HTTPS / REST + JWT| API
    API -->|Prisma ORM| DB

    subgraph "NestJS Modular Core"
        Auth["AuthModule (JWT & bcrypt)"]
        Users["UsersModule"]
        Projects["ProjectsModule (RBAC)"]
        Tasks["TasksModule (RBAC)"]
        Dashboard["DashboardModule"]
    end

    API --- Auth
    API --- Users
    API --- Projects
    API --- Tasks
    API --- Dashboard
```

---

## 2. Request Flow

When an HTTP request enters the NestJS application, it flows sequentially through security middleware, global pipes, authorization guards, and logging interceptors:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Next.js 15 Client
    participant Helmet as Helmet / CORS Middleware
    participant Pipe as Global ValidationPipe
    participant Guard as JwtAuthGuard & RolesGuard
    participant Controller as NestJS Controller
    participant Service as Domain Service
    participant Prisma as Prisma ORM
    participant DB as PostgreSQL DB

    User->>Frontend: Trigger action (e.g. Create Task)
    Frontend->>Helmet: HTTP POST /api/tasks (Bearer Token)
    Helmet->>Pipe: Validate DTO payload
    Pipe->>Guard: Verify JWT signature & check User Role
    Guard->>Controller: Route to @Post() handler
    Controller->>Service: Execute task logic
    Service->>Prisma: Database query
    Prisma->>DB: Execute SQL statement
    DB-->>Prisma: Return SQL result
    Prisma-->>Service: Return entity object
    Service-->>Controller: Return response payload
    Controller-->>Frontend: HTTP 201 Created (JSON)
    Frontend-->>User: Update UI & trigger toast notification
```

---

## 3. Authentication Flow

Authentication is built using JWT (JSON Web Tokens) signed with an HMAC SHA-256 secret.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Login Page
    participant API as /api/auth/login
    participant DB as User Database

    User->>UI: Enter Email & Password
    UI->>API: POST /auth/login { email, password }
    API->>DB: Find user by email
    DB-->>API: User record (with hashed password)
    API->>API: bcrypt.compare(password, hashedPassword)
    alt Invalid Credentials
        API-->>UI: HTTP 401 Unauthorized
    else Valid Credentials
        API->>API: Generate JWT Token (sub: userId, email, role)
        API-->>UI: HTTP 200 { user, accessToken }
        UI->>UI: Store token in localStorage
        UI-->>User: Redirect to /dashboard
    end
```

---

## 4. Role-Based Access Control (RBAC) Flow

The system enforces strict permission boundaries between `ADMIN` and `MEMBER` accounts:

```mermaid
graph TD
    Request["Incoming API Request"] --> JWTGuard{"Valid JWT Token?"}
    JWTGuard -- No --> 401["HTTP 401 Unauthorized"]
    JWTGuard -- Yes --> RolesGuard{"Check @Roles() Decorator"}
    
    RolesGuard -- No Decorator --> Allow["Allow Execution"]
    RolesGuard -- Requires ADMIN --> CheckAdmin{"User Role == ADMIN?"}
    
    CheckAdmin -- Yes --> Allow
    CheckAdmin -- No --> 403["HTTP 403 Forbidden"]
    
    RolesGuard -- Requires MEMBER --> CheckMember{"User Role == MEMBER or ADMIN?"}
    CheckMember -- Yes --> Allow
    CheckMember -- No --> 403
```

### Access Matrix

| Action | Admin Privilege | Member Privilege |
| :--- | :---: | :---: |
| **Create Project** | ✅ | ❌ |
| **Update Project** | ✅ | ❌ |
| **Delete Project** | ✅ | ❌ |
| **Create & Assign Task** | ✅ | ❌ |
| **Delete Task** | ✅ | ❌ |
| **View Dashboard** | ✅ (Global) | ✅ (Assigned Scope) |
| **View Projects** | ✅ (All) | ✅ (Assigned Only) |
| **Update Task Status** | ✅ | ✅ (Assigned Tasks) |

---

## 5. Database Entity Relationships

```mermaid
erDiagram
    User ||--o{ Project : "creates (UserCreatedProjects)"
    User ||--o{ Task : "assigned (UserAssignedTasks)"
    Project ||--o{ Task : "contains"

    User {
        string id PK
        string name
        string email UK
        string password
        Role role
        datetime createdAt
        datetime updatedAt
    }

    Project {
        string id PK
        string name
        string description
        string createdById FK
        datetime createdAt
        datetime updatedAt
    }

    Task {
        string id PK
        string title
        string description
        TaskStatus status
        TaskPriority priority
        datetime dueDate
        string assignedToId FK
        string projectId FK
        datetime createdAt
        datetime updatedAt
    }
```

---

## 6. Deployment Architecture

The application is prepared for deployment on **Railway** (or Nixpacks/Docker environments):

```mermaid
graph LR
    subgraph "Railway Infrastructure"
        FrontendApp["Railway App Service (apps/web)<br/>Next.js 15 SSR / Client"]
        BackendApp["Railway App Service (apps/api)<br/>NestJS REST API"]
        PostgresDB[(Railway Managed PostgreSQL)]
    end

    Users(("Web Users")) -->|HTTPS| FrontendApp
    FrontendApp -->|Internal/External HTTP| BackendApp
    BackendApp -->|SSL Connection| PostgresDB
```
