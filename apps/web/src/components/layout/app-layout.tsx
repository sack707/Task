'use client';

import React, { useState } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { useAuth } from '../../providers/auth-provider';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { token, isLoading } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return <main className="min-h-screen bg-[#090d16] text-slate-100">{children}</main>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Loading TaskPulse...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
