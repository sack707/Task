import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Updated task title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated task description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: TaskStatus.IN_PROGRESS, enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: TaskPriority.HIGH, enum: TaskPriority, required: false })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 'user-uuid-1234', required: false, nullable: true })
  @IsUUID()
  @IsOptional()
  assignedToId?: string | null;

  @ApiProperty({ example: 'project-uuid-5678', required: false })
  @IsUUID()
  @IsOptional()
  projectId?: string;
}
