import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new project (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Project successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin users' })
  async create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accessible projects' })
  @ApiResponse({ status: 200, description: 'List of projects retrieved' })
  async findAll(@CurrentUser() user: any) {
    return this.projectsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details by ID with associated tasks' })
  @ApiResponse({ status: 200, description: 'Project details retrieved' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.projectsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update project details (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Project successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin users' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a project (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Project successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin users' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
