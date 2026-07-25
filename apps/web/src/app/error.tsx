'use client';

import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-white">Something went wrong</h2>
      <p className="text-sm text-slate-400 max-w-md">
        {error.message || 'An unexpected application error occurred.'}
      </p>
      <Button onClick={reset} leftIcon={<RefreshCw className="w-4 h-4" />}>
        Try Again
      </Button>
    </div>
  );
}
