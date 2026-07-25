import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Design System Figma Tokens', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Export updated CSS variables', description: 'Detailed task description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: TaskStatus.TODO, enum: TaskStatus, required: false, default: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: TaskPriority.MEDIUM, enum: TaskPriority, required: false, default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', description: 'Task due date ISO string', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 'user-uuid-1234', description: 'Assigned user ID', required: false })
  @IsUUID()
  @IsOptional()
  assignedToId?: string;

  @ApiProperty({ example: 'project-uuid-5678', description: 'Associated project ID' })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;
}
