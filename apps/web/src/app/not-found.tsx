'use client';

import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
      <h2 className="text-lg font-semibold text-slate-300">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm">
        The requested URL could not be found or you do not have permission to view it.
      </p>
      <Link href="/dashboard">
        <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
