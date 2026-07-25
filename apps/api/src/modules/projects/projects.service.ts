import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Role } from '../../generated/prisma-client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  async findAll(user: any) {
    if (user.role === Role.ADMIN) {
      return this.prisma.project.findMany({
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          _count: { select: { tasks: true } },
          tasks: {
            select: { status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Member: return projects that either user created or has assigned tasks in
    return this.prisma.project.findMany({
      where: {
        OR: [
          { createdById: user.id },
          { tasks: { some: { assignedToId: user.id } } },
        ],
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true } },
        tasks: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user?: any) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true, email: true, role: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { tasks: true } },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID '${id}' not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
