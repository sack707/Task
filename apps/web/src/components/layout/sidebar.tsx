'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, User, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../providers/auth-provider';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Team Members', href: '/members', icon: Users },
    { name: 'My Profile', href: '/profile', icon: User },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-950/90 border-r border-slate-800/80 w-64 p-4 text-slate-300">
      <div className="flex items-center justify-between md:hidden pb-4 border-b border-slate-800">
        <span className="font-semibold text-sm text-slate-200">Navigation Menu</span>
        <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-4 space-y-1.5 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={clsx(
                'flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 font-semibold'
                  : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
              )}
            >
              <Icon className={clsx('w-4 h-4', isActive ? 'text-blue-400' : 'text-slate-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="mt-auto pt-4 border-t border-slate-800/80">
          <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800/60">
            <p className="text-xs font-semibold text-slate-300 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 z-50 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
