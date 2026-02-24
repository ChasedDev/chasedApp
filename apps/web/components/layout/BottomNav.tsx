'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useCartTotal } from '@/lib/hooks/useCart';

const navItems = [
  { href: '/',        label: 'Início',   icon: 'fa-house'           },
  { href: '/search',  label: 'Buscar',   icon: 'fa-magnifying-glass'},
  { href: '/cart',    label: 'Carrinho', icon: 'fa-cart-shopping', badge: true },
  { href: '/orders',  label: 'Pedidos',  icon: 'fa-clipboard-list'  },
  { href: '/profile', label: 'Perfil',   icon: 'fa-user'            },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCartTotal();

  return (
    /* Outer container — glass blur, border, shadow */
    <div
      className="fixed bottom-0 inset-x-0 z-50 flex justify-center"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)', paddingTop: '8px' }}>
      <nav
        className="flex items-center gap-1 px-2 py-2 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.6)',
        }}>
        {navItems.map(item => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const hasBadge = 'badge' in item && item.badge && itemCount > 0;

          return (
            <Link key={item.href} href={item.href}>
              {isActive ? (
                /* Active item: dark pill with label */
                <span className="flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-full bg-slate-900 text-white transition-all">
                  <i className={`fa-solid ${item.icon} text-[14px]`} />
                  <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>
                </span>
              ) : (
                /* Inactive: icon only with relative badge */
                <span className="relative flex items-center justify-center w-11 h-11 rounded-full text-slate-500 hover:bg-slate-200/60 transition-colors">
                  <i className={`fa-solid ${item.icon} text-[16px]`} />
                  {hasBadge && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
