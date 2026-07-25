'use client';

import React from 'react';
import { clsx } from 'clsx';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('animate-pulse rounded-md bg-slate-800/80', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div className="pt-2 flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
      <div className="flex items-center space-x-3 w-1/3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}
