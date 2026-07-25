'use client';

import React from 'react';
import { useAuth } from '../../providers/auth-provider';
import { Badge } from '../ui/badge';
import { LogOut, User as UserIcon, Shield, Menu } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export function Navbar({ onToggleMobileSidebar }: NavbarProps) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            T
          </div>
          <span className="font-semibold text-lg text-white tracking-tight hidden sm:inline">
            Task<span className="text-blue-500">Pulse</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
            <Link
              href="/profile"
              className="flex items-center space-x-2.5 group hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-semibold text-xs">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400">{user.email}</span>
              </div>
            </Link>

            <Badge variant={isAdmin ? 'purple' : 'info'} size="sm">
              {isAdmin ? (
                <>
                  <Shield className="w-3 h-3" /> ADMIN
                </>
              ) : (
                <>
                  <UserIcon className="w-3 h-3" /> MEMBER
                </>
              )}
            </Badge>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
