'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@chased/shared';
import { formatBRL } from '@chased/shared';
import { useCartStore } from '@/lib/store/cartStore';
import { useToast } from '@/lib/hooks/useToast';
import { postEvent } from '@/lib/api';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_qty === 0) return;
    addItem({ product_id: product.id, name: product.name, brand: product.brand, presentation: product.presentation, price_cents: product.price_cents, image_url: product.image_url, qty: 1, stock_qty: product.stock_qty });
    toast({ message: `${product.name} adicionado!`, type: 'success' });
    postEvent('add_to_cart', { product_id: product.id, qty: 1 });
  };

  return (
    <Link href={`/product/${product.id}`} className="group card overflow-hidden hover:shadow-elevated transition-all hover:-translate-y-0.5 block">
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <i className="fa-solid fa-pills text-4xl text-slate-200" />
          </div>
        )}
        {product.stock_qty === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">Esgotado</span>
          </div>
        )}
        {product.brand && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-medium text-slate-600 px-2 py-0.5 rounded-full">
            {product.brand}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm leading-tight text-slate-900 truncate">{product.name}</p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{product.presentation}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-brand-600 font-bold text-sm">{formatBRL(product.price_cents)}</span>
          <button onClick={handleQuickAdd} disabled={product.stock_qty === 0}
            className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm shadow-brand-600/30 active:scale-90">
            <i className="fa-solid fa-plus text-xs" />
          </button>
        </div>
      </div>
    </Link>
  );
}
