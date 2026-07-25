import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../generated/prisma-client';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new task (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin users' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accessible tasks with optional project filter' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async findAll(@CurrentUser() user: any, @Query('projectId') projectId?: string) {
    return this.tasksService.findAll(user, projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task details by ID' })
  @ApiResponse({ status: 200, description: 'Task details retrieved' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update full task details (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin users' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status of a task (ADMIN & MEMBER)' })
  @ApiResponse({ status: 200, description: 'Task status updated' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(id, updateTaskStatusDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a task (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin users' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
