'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { DashboardData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { TaskStatusBadge } from '../../components/tasks/task-status-badge';
import { TaskPriorityBadge } from '../../components/tasks/task-priority-badge';
import { Skeleton, CardSkeleton } from '../../components/ui/skeleton';
import { FolderKanban, CheckSquare, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-rose-400 bg-rose-950/20 border border-rose-900/50 rounded-xl">
        Failed to load dashboard data: {error?.message || 'Unknown error'}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Projects',
      value: data.totalProjects,
      icon: FolderKanban,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      href: '/projects',
    },
    {
      title: 'Total Tasks',
      value: data.totalTasks,
      icon: CheckSquare,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      href: '/tasks',
    },
    {
      title: 'Completed Tasks',
      value: data.completedTasks,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      href: '/tasks?status=DONE',
    },
    {
      title: 'Pending Tasks',
      value: data.pendingTasks,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      href: '/tasks?status=IN_PROGRESS',
    },
    {
      title: 'Overdue Tasks',
      value: data.overdueTasks,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      href: '/tasks',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor active workspace deliverables, task deadlines, and team progress metrics.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <Card hoverable className="h-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
                  <div className={`p-2 rounded-lg border ${card.bg} ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{card.value}</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Latest project workspaces created</p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.recentProjects.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No recent projects found</p>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {data.recentProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between py-3 hover:bg-slate-800/40 px-2 rounded-lg transition-colors group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {p.description || 'No description provided'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                        {p._count?.tasks || 0} tasks
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Newly logged action items across all projects</p>
            </div>
            <Link
              href="/tasks"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.recentTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No recent tasks found</p>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {data.recentTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-3 hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-200">{t.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span>{t.project?.name || 'Unassigned Project'}</span>
                        <span>•</span>
                        <span>{t.assignedTo ? t.assignedTo.name : 'Unassigned'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <TaskPriorityBadge priority={t.priority} />
                      <TaskStatusBadge status={t.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
