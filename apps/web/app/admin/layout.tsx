'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { href: '/admin',            label: 'Dashboard', icon: 'fa-chart-line',    exact: true },
  { href: '/admin/products',   label: 'Produtos',  icon: 'fa-pills'          },
  { href: '/admin/orders',     label: 'Pedidos',   icon: 'fa-clipboard-list' },
  { href: '/admin/categories', label: 'Categ.',    icon: 'fa-tags'           },
  { href: '/admin/settings',   label: 'Config.',   icon: 'fa-gear'           },
] as const;

const sidebarItems = [
  { href: '/admin',            label: 'Dashboard',    icon: 'fa-chart-line',    exact: true },
  { href: '/admin/products',   label: 'Produtos',     icon: 'fa-pills'          },
  { href: '/admin/categories', label: 'Categorias',   icon: 'fa-tags'           },
  { href: '/admin/promos',     label: 'Banners',      icon: 'fa-image'          },
  { href: '/admin/orders',     label: 'Pedidos',      icon: 'fa-clipboard-list' },
  { href: '/admin/settings',   label: 'Configurações',icon: 'fa-gear'           },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const qc = useQueryClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    qc.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-40">
        <div className="px-5 h-16 flex items-center gap-3 border-b border-slate-100 shrink-0">
          <div className="w-9 h-9 bg-brand-600 rounded-2xl flex items-center justify-center shadow-sm shadow-brand-600/40">
            <i className="fa-solid fa-capsules text-white text-base" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">Chased</p>
            <p className="text-xs text-slate-400 mt-0.5">Administração</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(item => (
            <Link key={item.href} href={item.href}
              className={clsx('flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                isActive(item) ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25' : 'text-slate-600 hover:bg-slate-100')}>
              <i className={clsx('fa-solid', item.icon, 'w-4 text-center text-sm')} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button onClick={handleLogout} disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
            {loggingOut ? <i className="fa-solid fa-circle-notch fa-spin w-4" /> : <i className="fa-solid fa-right-from-bracket w-4" />}
            Sair da conta
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-14 flex items-center px-4 gap-3">
        <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
          <i className="fa-solid fa-capsules text-white text-sm" />
        </div>
        <span className="font-bold text-slate-900 flex-1">Chased Admin</span>
        <button onClick={handleLogout} disabled={loggingOut}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all">
          {loggingOut ? <i className="fa-solid fa-circle-notch fa-spin" /> : <i className="fa-solid fa-right-from-bracket" />}
          Sair
        </button>
      </header>

      {/* ── Mobile bottom nav (pill style, same as client) ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex justify-center"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)', paddingTop: '8px' }}>
        <nav className="flex items-center gap-1 px-2 py-2 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.6)',
          }}>
          {navItems.map(item => {
            const active = isActive(item);
            return (
              <Link key={item.href} href={item.href}>
                {active ? (
                  <span className="flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-full bg-slate-900 text-white">
                    <i className={`fa-solid ${item.icon} text-[13px]`} />
                    <span className="text-[13px] font-semibold">{item.label}</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-11 h-11 rounded-full text-slate-500 hover:bg-slate-200/60 transition-colors">
                    <i className={`fa-solid ${item.icon} text-[16px]`} />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Main ── */}
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-24 lg:pb-0 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
