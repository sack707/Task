import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role, TaskStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(user: any) {
    const now = new Date();
    const isAdmin = user.role === Role.ADMIN;

    // Project filtering condition based on Role
    const projectWhere = isAdmin
      ? {}
      : {
          OR: [
            { createdById: user.id },
            { tasks: { some: { assignedToId: user.id } } },
          ],
        };

    // Task filtering condition based on Role
    const taskWhere = isAdmin
      ? {}
      : {
          OR: [
            { assignedToId: user.id },
            { project: { createdById: user.id } },
          ],
        };

    const [
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      recentProjects,
      recentTasks,
    ] = await Promise.all([
      // Total Projects
      this.prisma.project.count({ where: projectWhere }),

      // Total Tasks
      this.prisma.task.count({ where: taskWhere }),

      // Completed Tasks
      this.prisma.task.count({
        where: {
          ...taskWhere,
          status: TaskStatus.DONE,
        },
      }),

      // Pending Tasks (TODO or IN_PROGRESS)
      this.prisma.task.count({
        where: {
          ...taskWhere,
          status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
        },
      }),

      // Overdue Tasks (dueDate < now AND status != DONE)
      this.prisma.task.count({
        where: {
          ...taskWhere,
          dueDate: { lt: now },
          status: { not: TaskStatus.DONE },
        },
      }),

      // Recent Projects
      this.prisma.project.findMany({
        where: projectWhere,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Recent Tasks
      this.prisma.task.findMany({
        where: taskWhere,
        include: {
          project: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      recentProjects,
      recentTasks,
    };
  }
}
