'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Project } from '../../types';
import { useAuth } from '../../providers/auth-provider';
import { useToast } from '../../components/ui/toast';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CreateProjectModal } from '../../components/projects/create-project-modal';
import { EditProjectModal } from '../../components/projects/edit-project-modal';
import { Dialog } from '../../components/ui/dialog';
import { CardSkeleton } from '../../components/ui/skeleton';
import { Plus, FolderKanban, Edit2, Trash2, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      toast.success('Project Deleted', 'The project and its tasks have been removed.');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeletingProject(null);
    },
    onError: (err: Error) => {
      toast.error('Failed to delete project', err.message);
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize work streams, assign tasks, and monitor workspace completion targets.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Project
          </Button>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 text-center text-rose-400 bg-rose-950/20 border border-rose-900/50 rounded-xl">
          Error loading projects: {error.message}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {isAdmin
              ? 'Get started by creating your first project workspace.'
              : 'You have not been assigned to any project workspace yet.'}
          </p>
          {isAdmin && (
            <Button onClick={() => setCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Create Project
            </Button>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} hoverable className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                    {isAdmin && (
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProject(project)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 mt-1">
                    {project.description || 'No description provided for this project workspace.'}
                  </CardDescription>
                </CardHeader>

                <div className="px-5 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Owner: {project.createdBy?.name || 'Admin'}</span>
                  </div>
                </div>
              </div>

              <CardFooter className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  {project._count?.tasks || 0} Tasks
                </span>

                <Link href={`/projects/${project.id}`}>
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <EditProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        project={editingProject}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        title="Delete Project Workspace"
        description="Are you sure you want to permanently delete this project? All associated tasks will be removed."
      >
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button variant="outline" onClick={() => setDeletingProject(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={deleteMutation.isPending}
            onClick={() => deletingProject && deleteMutation.mutate(deletingProject.id)}
          >
            Delete Project
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
