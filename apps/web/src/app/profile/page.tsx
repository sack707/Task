'use client';

import React from 'react';
import { useAuth } from '../../providers/auth-provider';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { User, Mail, Shield, Calendar, LogOut, CheckSquare } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Account details and security privileges
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 border border-blue-400/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/20">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="mt-2">
              <Badge variant={isAdmin ? 'purple' : 'info'}>
                {isAdmin ? (
                  <>
                    <Shield className="w-3 h-3" /> ADMIN ACCOUNT
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3" /> MEMBER ACCOUNT
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center text-slate-400 text-xs gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </div>
              <p className="text-slate-200 font-medium">{user.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center text-slate-400 text-xs gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5" /> Member Since
              </div>
              <p className="text-slate-200 font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Role Permissions Overview
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAdmin
                ? 'As an Administrator, you have full authority to create, edit, and delete projects, create and assign tasks to any team member, and manage system resources.'
                : 'As a Member, you have access to view projects, view your assigned tasks, and update task execution statuses.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button
              variant="danger"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
