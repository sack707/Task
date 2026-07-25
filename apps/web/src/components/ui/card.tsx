'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 text-slate-100 shadow-lg shadow-black/20',
        hoverable && 'transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('flex flex-col space-y-1.5 mb-4', className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx('text-lg font-semibold tracking-tight text-white', className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={clsx('text-xs text-slate-400', className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between', className)} {...props}>{children}</div>;
}
