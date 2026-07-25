'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Task, TaskStatus, TaskPriority, Role } from '../../types';
import { useAuth } from '../../providers/auth-provider';
import { useToast } from '../../components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { TaskStatusBadge } from '../../components/tasks/task-status-badge';
import { TaskPriorityBadge } from '../../components/tasks/task-priority-badge';
import { CreateTaskModal } from '../../components/tasks/create-task-modal';
import { EditTaskModal } from '../../components/tasks/edit-task-modal';
import { Dialog } from '../../components/ui/dialog';
import { TableRowSkeleton } from '../../components/ui/skeleton';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  SlidersHorizontal,
  CheckCircle2,
  ArrowUpDown,
} from 'lucide-react';

export default function TasksPage() {
  const { isAdmin, user: currentUser } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');

  const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      const res = await api.patch(`/tasks/${taskId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Task Status Updated');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeletingTask(null);
    },
    onError: (err: Error) => {
      toast.error('Failed to delete task', err.message);
    },
  });

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchesSearch =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (t.project?.name && t.project.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'priority') {
          const priorityWeight: Record<TaskPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        // Default createdAt desc
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, filter, assign, and manage execution progress across all deliverables.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Task
          </Button>
        )}
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search tasks or projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'ALL' },
              { label: 'To Do', value: 'TODO' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Done', value: 'DONE' },
            ]}
          />

          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { label: 'All Priorities', value: 'ALL' },
              { label: 'High Priority', value: 'HIGH' },
              { label: 'Medium Priority', value: 'MEDIUM' },
              { label: 'Low Priority', value: 'LOW' },
            ]}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { label: 'Sort by Date Created', value: 'createdAt' },
              { label: 'Sort by Due Date', value: 'dueDate' },
              { label: 'Sort by Title', value: 'title' },
              { label: 'Sort by Priority', value: 'priority' },
            ]}
          />
        </div>
      </Card>

      {/* Tasks Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task Registry ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-3">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </div>
          )}

          {error && (
            <div className="p-6 text-center text-rose-400 bg-rose-950/20 border border-rose-900/50 rounded-xl">
              Failed to load tasks: {error.message}
            </div>
          )}

          {!isLoading && !error && filteredTasks.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No matching tasks found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria or create a new task.
              </p>
            </div>
          )}

          {!isLoading && filteredTasks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Task Details</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Assignee</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Due Date</th>
                    {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTasks.map((task) => {
                    const isAssignedToMe = task.assignedToId === currentUser?.id;
                    const canChangeStatus = isAdmin || isAssignedToMe;

                    return (
                      <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-semibold text-slate-200 block">{task.title}</span>
                          {task.description && (
                            <span className="text-xs text-slate-400 line-clamp-1">{task.description}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-blue-400">
                          {task.project?.name || 'Unassigned'}
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
                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                                title="Edit Task"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingTask(task)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
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
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
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
