'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { User } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { TableRowSkeleton } from '../../components/ui/skeleton';
import { Users, Shield, User as UserIcon, CheckSquare, FolderKanban } from 'lucide-react';

export default function MembersPage() {
  const { data: members = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Team Members</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          View directory of workspace collaborators and their workload breakdown.
        </p>
      </div>

      {/* Members Directory Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <CardTitle>Workspace Directory ({members.length})</CardTitle>
          </div>
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
              Failed to load team directory: {error.message}
            </div>
          )}

          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Assigned Tasks</th>
                    <th className="py-3 px-4">Created Projects</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-200 block">{member.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">{member.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={member.role === 'ADMIN' ? 'purple' : 'info'}>
                          {member.role === 'ADMIN' ? (
                            <>
                              <Shield className="w-3 h-3" /> ADMIN
                            </>
                          ) : (
                            <>
                              <UserIcon className="w-3 h-3" /> MEMBER
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                          <span>{member._count?.assignedTasks || 0} tasks</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          <FolderKanban className="w-3.5 h-3.5 text-slate-500" />
                          <span>{member._count?.createdProjects || 0} projects</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
