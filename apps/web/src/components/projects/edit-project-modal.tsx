'use client';

import React, { useEffect } from 'react';
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
import { Project } from '../../types';

const schema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (project) {
      setValue('name', project.name);
      setValue('description', project.description || '');
    }
  }, [project, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!project) return;
      const response = await api.patch(`/projects/${project.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Project Updated', 'Changes saved successfully');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', project?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (err: Error) => {
      toast.error('Failed to update project', err.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit Project" description="Update project metadata">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Project Name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Textarea
          label="Description"
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
