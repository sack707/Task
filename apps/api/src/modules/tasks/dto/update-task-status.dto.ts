import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../../../generated/prisma-client';

export class UpdateTaskStatusDto {
  @ApiProperty({ example: TaskStatus.DONE, enum: TaskStatus, description: 'New task status' })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status!: TaskStatus;
}
