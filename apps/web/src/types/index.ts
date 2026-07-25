export type Role = 'ADMIN' | 'MEMBER';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  _count?: {
    assignedTasks?: number;
    createdProjects?: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  createdById: string;
  createdBy?: Partial<User>;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks?: number;
  };
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  assignedToId?: string | null;
  assignedTo?: Partial<User> | null;
  projectId: string;
  project?: Partial<Project>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  recentProjects: Project[];
  recentTasks: Task[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
