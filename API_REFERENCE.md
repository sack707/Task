# Complete REST API Documentation

Base URL: `http://localhost:4000/api`  
Interactive Swagger Docs: `http://localhost:4000/api/docs`

---

## Table of Contents
- [Authentication Headers](#authentication-headers)
- [Auth Endpoints](#auth-endpoints)
- [Users Endpoints](#users-endpoints)
- [Projects Endpoints](#projects-endpoints)
- [Tasks Endpoints](#tasks-endpoints)
- [Dashboard Endpoints](#dashboard-endpoints)
- [Error Responses](#error-responses)

---

## Authentication Headers

Protected endpoints require a Bearer token in the `Authorization` request header:

```http
Authorization: Bearer <your_jwt_access_token>
```

---

## Auth Endpoints

### 1. Register User
- **Endpoint**: `POST /auth/signup`
- **Auth Required**: None
- **Request Body**:
```json
{
  "name": "Alex Smith",
  "email": "alex@example.com",
  "password": "Password123!",
  "role": "MEMBER" // Optional: "ADMIN" or "MEMBER" (default "MEMBER")
}
```
- **Response (201 Created)**:
```json
{
  "user": {
    "id": "u1234567-89ab-cdef-0123-456789abcdef",
    "name": "Alex Smith",
    "email": "alex@example.com",
    "role": "MEMBER",
    "createdAt": "2026-07-25T16:00:00.000Z",
    "updatedAt": "2026-07-25T16:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User
- **Endpoint**: `POST /auth/login`
- **Auth Required**: None
- **Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK)**:
```json
{
  "user": {
    "id": "u-admin-uuid",
    "name": "System Admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2026-07-25T16:00:00.000Z",
    "updatedAt": "2026-07-25T16:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Current User Profile
- **Endpoint**: `GET /auth/me`
- **Auth Required**: Bearer Token
- **Response (200 OK)**:
```json
{
  "id": "u-admin-uuid",
  "name": "System Admin",
  "email": "admin@example.com",
  "role": "ADMIN",
  "createdAt": "2026-07-25T16:00:00.000Z",
  "updatedAt": "2026-07-25T16:00:00.000Z"
}
```

---

## Users Endpoints

### 1. Get All Users
- **Endpoint**: `GET /users`
- **Auth Required**: Bearer Token
- **Response (200 OK)**:
```json
[
  {
    "id": "u-admin-uuid",
    "name": "System Admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2026-07-25T16:00:00.000Z",
    "updatedAt": "2026-07-25T16:00:00.000Z",
    "_count": {
      "assignedTasks": 2,
      "createdProjects": 3
    }
  }
]
```

### 2. Get User By ID
- **Endpoint**: `GET /users/:id`
- **Auth Required**: Bearer Token
- **Response (200 OK)**:
```json
{
  "id": "u-member1-uuid",
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "role": "MEMBER",
  "assignedTasks": [
    {
      "id": "t1",
      "title": "Implement Navigation Sidebar",
      "status": "IN_PROGRESS",
      "priority": "MEDIUM",
      "project": { "id": "p1", "name": "Platform Redesign v2" }
    }
  ],
  "createdProjects": []
}
```

---

## Projects Endpoints

### 1. Get All Projects
- **Endpoint**: `GET /projects`
- **Auth Required**: Bearer Token
- **Response (200 OK)**: Returns accessible project workspaces based on role rules.

### 2. Get Project By ID
- **Endpoint**: `GET /projects/:id`
- **Auth Required**: Bearer Token
- **Response (200 OK)**: Returns project details with nested tasks array.

### 3. Create Project
- **Endpoint**: `POST /projects`
- **Auth Required**: Bearer Token (**ADMIN only**)
- **Request Body**:
```json
{
  "name": "Mobile App API Integration",
  "description": "REST API expansion for iOS and Android native clients."
}
```
- **Response (201 Created)**: Returns created project entity.

### 4. Update Project
- **Endpoint**: `PATCH /projects/:id`
- **Auth Required**: Bearer Token (**ADMIN only**)
- **Request Body**:
```json
{
  "name": "Mobile App API Integration v2",
  "description": "Updated scope description"
}
```

### 5. Delete Project
- **Endpoint**: `DELETE /projects/:id`
- **Auth Required**: Bearer Token (**ADMIN only**)
- **Response (200 OK)**: Returns deleted project object.

---

## Tasks Endpoints

### 1. Get All Tasks
- **Endpoint**: `GET /tasks`
- **Query Parameters**: `projectId` (optional filter)
- **Auth Required**: Bearer Token
- **Response (200 OK)**: Array of tasks accessible to user.

### 2. Get Task By ID
- **Endpoint**: `GET /tasks/:id`
- **Auth Required**: Bearer Token

### 3. Create Task
- **Endpoint**: `POST /tasks`
- **Auth Required**: Bearer Token (**ADMIN only**)
- **Request Body**:
```json
{
  "title": "OAuth2 Authentication Service",
  "description": "Implement JWT refresh token mechanism",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-12-31T23:59:59.000Z",
  "assignedToId": "u-member1-uuid",
  "projectId": "p1-project-uuid"
}
```

### 4. Update Full Task
- **Endpoint**: `PATCH /tasks/:id`
- **Auth Required**: Bearer Token (**ADMIN only**)

### 5. Update Task Status
- **Endpoint**: `PATCH /tasks/:id/status`
- **Auth Required**: Bearer Token (**ADMIN & Assigned Member**)
- **Request Body**:
```json
{
  "status": "DONE" // "TODO" | "IN_PROGRESS" | "DONE"
}
```

### 6. Delete Task
- **Endpoint**: `DELETE /tasks/:id`
- **Auth Required**: Bearer Token (**ADMIN only**)

---

## Dashboard Endpoints

### 1. Get Dashboard Metrics
- **Endpoint**: `GET /dashboard`
- **Auth Required**: Bearer Token
- **Response (200 OK)**:
```json
{
  "totalProjects": 3,
  "totalTasks": 10,
  "completedTasks": 3,
  "pendingTasks": 7,
  "overdueTasks": 2,
  "recentProjects": [...],
  "recentTasks": [...]
}
```

---

## Error Responses

All API errors return a standard JSON payload format:

```json
{
  "statusCode": 400,
  "timestamp": "2026-07-25T16:00:00.000Z",
  "path": "/api/tasks",
  "message": "Password must be at least 8 characters long"
}
```
