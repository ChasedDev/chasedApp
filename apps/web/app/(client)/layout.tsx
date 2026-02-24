import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-4 pt-4 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
