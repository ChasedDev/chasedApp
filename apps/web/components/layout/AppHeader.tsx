'use client';
import Link from 'next/link';
import { useCartTotal } from '@/lib/hooks/useCart';

export function AppHeader() {
  const { itemCount } = useCartTotal();
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-2xl mx-auto px-4 h-[60px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-capsules text-white text-sm" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Chased</span>
        </Link>
        <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 transition-colors">
          <i className="fa-solid fa-cart-shopping text-slate-600 text-lg" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
