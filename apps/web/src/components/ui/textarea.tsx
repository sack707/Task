'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={clsx(
            'w-full rounded-lg border bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 min-h-[100px]',
            error ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-800 hover:border-slate-700',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
