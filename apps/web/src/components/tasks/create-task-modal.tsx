'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { api } from '../../lib/api';
import { useToast } from '../ui/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Project, User, TaskStatus, TaskPriority } from '../../types';

const schema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project selection is required'),
  assignedToId: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'] as const),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'] as const),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function CreateTaskModal({ isOpen, onClose, defaultProjectId }: CreateTaskModalProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
    enabled: isOpen,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
    enabled: isOpen,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: defaultProjectId || '',
      status: 'TODO',
      priority: 'MEDIUM',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload: any = { ...data };
      if (!payload.assignedToId) delete payload.assignedToId;
      if (!payload.dueDate) delete payload.dueDate;
      const response = await api.post('/tasks', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Task Created', 'New task added successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      reset();
      onClose();
    },
    onError: (err: Error) => {
      toast.error('Failed to create task', err.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const projectOptions = [
    { label: 'Select Project...', value: '' },
    ...projects.map((p) => ({ label: p.name, value: p.id })),
  ];

  const userOptions = [
    { label: 'Unassigned', value: '' },
    ...users.map((u) => ({ label: `${u.name} (${u.role})`, value: u.id })),
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create New Task" description="Assign deliverables and set milestone targets">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g., Implement OAuth2 flow"
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Include acceptance criteria and technical notes..."
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project"
            options={projectOptions}
            error={errors.projectId?.message}
            {...register('projectId')}
          />

          <Select
            label="Assigned Member"
            options={userOptions}
            error={errors.assignedToId?.message}
            {...register('assignedToId')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Status"
            options={[
              { label: 'To Do', value: 'TODO' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Done', value: 'DONE' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />

          <Select
            label="Priority"
            options={[
              { label: 'Low', value: 'LOW' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'High', value: 'HIGH' },
            ]}
            error={errors.priority?.message}
            {...register('priority')}
          />

          <Input
            label="Due Date"
            type="date"
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            Create Task
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
