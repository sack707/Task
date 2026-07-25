import { CardSkeleton, TableRowSkeleton } from '../components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-800 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="h-6 w-36 bg-slate-800 rounded" />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
    </div>
  );
}
