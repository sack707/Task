'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  const base = 'inline-flex items-center font-medium rounded-full tracking-wide';
  
  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    outline: 'bg-transparent text-slate-400 border border-slate-700',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
  };

  return (
    <span className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
