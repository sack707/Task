import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Role } from '../../generated/prisma-client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    // Validate project existence
    const project = await this.prisma.project.findUnique({
      where: { id: createTaskDto.projectId },
    });
    if (!project) {
      throw new BadRequestException(`Project with ID '${createTaskDto.projectId}' does not exist`);
    }

    // Validate assigned user if provided
    if (createTaskDto.assignedToId) {
      const user = await this.prisma.user.findUnique({
        where: { id: createTaskDto.assignedToId },
      });
      if (!user) {
        throw new BadRequestException(`User with ID '${createTaskDto.assignedToId}' does not exist`);
      }
    }

    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        assignedToId: createTaskDto.assignedToId || null,
        projectId: createTaskDto.projectId,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  async findAll(user: any, projectId?: string) {
    const whereClause: any = {};

    if (projectId) {
      whereClause.projectId = projectId;
    }

    if (user.role === Role.MEMBER) {
      whereClause.OR = [
        { assignedToId: user.id },
        { project: { createdById: user.id } },
      ];
    }

    return this.prisma.task.findMany({
      where: whereClause,
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true, description: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID '${id}' not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);

    if (updateTaskDto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: updateTaskDto.projectId },
      });
      if (!project) {
        throw new BadRequestException(`Project with ID '${updateTaskDto.projectId}' does not exist`);
      }
    }

    if (updateTaskDto.assignedToId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateTaskDto.assignedToId },
      });
      if (!user) {
        throw new BadRequestException(`User with ID '${updateTaskDto.assignedToId}' does not exist`);
      }
    }

    const dataToUpdate: any = { ...updateTaskDto };
    if (updateTaskDto.dueDate !== undefined) {
      dataToUpdate.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null;
    }

    return this.prisma.task.update({
      where: { id },
      data: dataToUpdate,
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  async updateStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: { status: updateTaskStatusDto.status },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
