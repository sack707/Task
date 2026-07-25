import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Platform Redesign v3', description: 'Updated name of project', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Updated project description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
