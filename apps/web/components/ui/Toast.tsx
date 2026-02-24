'use client';
import { createContext, useState, useCallback } from 'react';
import clsx from 'clsx';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }
interface ToastContextValue { toast: (t: Omit<Toast, 'id'>) => void; }
export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90vw] max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={clsx('px-4 py-3 rounded-2xl text-sm font-medium text-white shadow-xl pointer-events-auto flex items-center gap-2',
            t.type === 'success' && 'bg-emerald-500',
            t.type === 'error' && 'bg-red-500',
            t.type === 'info' && 'bg-slate-800')}>
            <i className={clsx('fa-solid', t.type === 'success' && 'fa-circle-check', t.type === 'error' && 'fa-circle-xmark', t.type === 'info' && 'fa-circle-info')} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
