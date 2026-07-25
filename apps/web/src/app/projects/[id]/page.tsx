'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { Project, TaskStatus } from '../../../types';
import { useAuth } from '../../../providers/auth-provider';
import { useToast } from '../../../components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { TaskStatusBadge } from '../../../components/tasks/task-status-badge';
import { TaskPriorityBadge } from '../../../components/tasks/task-priority-badge';
import { CreateTaskModal } from '../../../components/tasks/create-task-modal';
import { EditTaskModal } from '../../../components/tasks/edit-task-modal';
import { EditProjectModal } from '../../../components/projects/edit-project-modal';
import { Dialog } from '../../../components/ui/dialog';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  User,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { isAdmin, user: currentUser } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [deletingTask, setDeletingTask] = useState<any>(null);

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await api.get(`/projects/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      const res = await api.patch(`/tasks/${taskId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Task Status Updated');
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err: Error) => {
      toast.error('Failed to update status', err.message);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      toast.success('Task Deleted');
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeletingTask(null);
    },
    onError: (err: Error) => {
      toast.error('Failed to delete task', err.message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center text-rose-400 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-3">
        <p>Project not found or accessible.</p>
        <Link href="/projects">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const tasks = project.tasks || [];
  const completedCount = tasks.filter((t) => t.status === 'DONE').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back Navigation */}
      <div>
        <Link href="/projects" className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Projects
        </Link>
      </div>

      {/* Project Banner Card */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {project.name}
              </h1>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {project.description || 'No description available for this project.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" /> Created by {project.createdBy?.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />{' '}
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-4 shrink-0">
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Edit2 className="w-4 h-4" />}
                  onClick={() => setEditingProject(project)}
                >
                  Edit Project
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setCreateTaskModalOpen(true)}
                >
                  Add Task
                </Button>
              </div>
            )}

            {/* Completion Bar */}
            <div className="w-full sm:w-48 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Progress</span>
                <span className="text-blue-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block text-right">
                {completedCount} of {tasks.length} tasks completed
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Project Action Items</CardTitle>
            <p className="text-xs text-slate-400 mt-1">
              Deliverables linked directly to this project workspace
            </p>
          </div>
          {isAdmin && (
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setCreateTaskModalOpen(true)}
            >
              New Task
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {tasks.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No tasks created yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isAdmin
                  ? 'Add your first task to start tracking work for this project.'
                  : 'No tasks have been assigned in this project yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Task</th>
                    <th className="py-3 px-4">Assignee</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Due Date</th>
                    {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tasks.map((task) => {
                    const isAssignedToMe = task.assignedToId === currentUser?.id;
                    const canChangeStatus = isAdmin || isAssignedToMe;

                    return (
                      <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-200 block">{task.title}</span>
                          {task.description && (
                            <span className="text-xs text-slate-400 line-clamp-1">{task.description}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-300">
                          {task.assignedTo ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                                {task.assignedTo.name?.slice(0, 2).toUpperCase()}
                              </div>
                              <span>{task.assignedTo.name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <TaskPriorityBadge priority={task.priority} />
                        </td>
                        <td className="py-3 px-4">
                          {canChangeStatus ? (
                            <select
                              value={task.status}
                              onChange={(e) =>
                                updateStatusMutation.mutate({
                                  taskId: task.id,
                                  status: e.target.value as TaskStatus,
                                })
                              }
                              className="bg-slate-900 border border-slate-700 rounded-lg text-xs py-1 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="TODO">To Do</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="DONE">Done</option>
                            </select>
                          ) : (
                            <TaskStatusBadge status={task.status} />
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-400">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : 'No due date'}
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => setEditingTask(task)}
                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg"
                                title="Edit Task"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingTask(task)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                                title="Delete Task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        defaultProjectId={id}
      />

      <EditProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        project={editingProject}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />

      <Dialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      >
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button variant="outline" onClick={() => setDeletingTask(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={deleteTaskMutation.isPending}
            onClick={() => deletingTask && deleteTaskMutation.mutate(deletingTask.id)}
          >
            Delete Task
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
