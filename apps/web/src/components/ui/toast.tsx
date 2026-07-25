'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (title: string, description?: string, type?: ToastType) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (title: string, description?: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, title, description, type };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => toast(title, description, 'success'),
    [toast]
  );

  const error = useCallback(
    (title: string, description?: string) => toast(title, description, 'error'),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-lg text-slate-100 transition-all transform animate-in slide-in-from-right-full duration-200',
              t.type === 'success' && 'bg-emerald-950/90 border-emerald-800 text-emerald-200',
              t.type === 'error' && 'bg-rose-950/90 border-rose-800 text-rose-200',
              t.type === 'info' && 'bg-slate-900/90 border-slate-700 text-slate-200'
            )}
          >
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-tight">{t.title}</h4>
              {t.description && <p className="mt-1 text-xs opacity-90">{t.description}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded-md hover:bg-black/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
