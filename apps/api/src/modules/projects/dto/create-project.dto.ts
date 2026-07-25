import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Platform Redesign v2', description: 'Name of the project' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Modernizing core design components', description: 'Project overview and scope', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
