'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { api } from '../../lib/api';
import { useToast } from '../ui/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await api.post('/projects', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Project Created', 'The project has been added successfully');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      reset();
      onClose();
    },
    onError: (err: Error) => {
      toast.error('Failed to create project', err.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create New Project" description="Set up a workspace for team collaboration">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Project Name"
          placeholder="e.g., Platform Redesign v2"
          error={errors.name?.message}
          {...register('name')}
        />
        <Textarea
          label="Description (Optional)"
          placeholder="Summarize project scope and target milestones..."
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            Create Project
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
