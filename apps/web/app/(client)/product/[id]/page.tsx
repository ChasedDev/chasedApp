'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Product } from '@chased/shared';
import { formatBRL } from '@chased/shared';
import { useCartStore } from '@/lib/store/cartStore';
import { QuantitySelector } from '@/components/QuantitySelector';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/lib/hooks/useToast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { postEvent } from '@/lib/api';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { addItem, items } = useCartStore();
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetch(`/api/products/${id}`).then(r => r.json()),
    enabled: !!id,
  });

  useEffect(() => {
    if (product) postEvent('product_view', { product_id: product.id });
  }, [product]);

  if (isLoading) return <LoadingSpinner />;
  if (!product || product.id === undefined) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-slate-300" />
      <p className="text-slate-500">Produto não encontrado</p>
      <button onClick={() => router.back()} className="btn-ghost"><i className="fa-solid fa-arrow-left" />Voltar</button>
    </div>
  );

  const cartItem = items.find(i => i.product_id === product.id);

  const handleAddToCart = () => {
    addItem({ product_id: product.id, name: product.name, brand: product.brand, presentation: product.presentation, price_cents: product.price_cents, image_url: product.image_url, qty, stock_qty: product.stock_qty });
    toast({ message: `${product.name} adicionado!`, type: 'success' });
    postEvent('add_to_cart', { product_id: product.id, qty });
  };

  return (
    <div className="pb-nav">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4 pt-2">
        <i className="fa-solid fa-arrow-left" /> Voltar
      </button>
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-50 mb-6">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <i className="fa-solid fa-pills text-8xl text-slate-200" />
          </div>
        )}
        {product.stock_qty === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-slate-700 font-bold px-4 py-2 rounded-full">Esgotado</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          {product.brand && <p className="text-sm font-medium text-brand-600 mb-1">{product.brand}</p>}
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-1.5">
            <i className="fa-solid fa-tag text-xs text-slate-400" />
            {product.presentation}
          </p>
          {product.description && <p className="text-slate-500 text-sm mt-3 leading-relaxed">{product.description}</p>}
        </div>

        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Preço unitário</p>
            <span className="text-3xl font-bold text-brand-600">{formatBRL(product.price_cents)}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-0.5">Estoque</p>
            <p className="font-semibold text-slate-700 flex items-center gap-1 justify-end">
              <i className="fa-solid fa-cubes-stacked text-xs text-slate-400" />
              {product.stock_qty} un.
            </p>
          </div>
        </div>

        {cartItem && (
          <div className="bg-brand-50 border border-brand-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-brand-700 text-sm font-medium">
            <i className="fa-solid fa-circle-check" />
            {cartItem.qty} unidade(s) no carrinho
          </div>
        )}

        <div className="flex gap-3">
          <QuantitySelector value={qty} onChange={setQty} min={1} max={product.stock_qty} />
          <PrimaryButton className="flex-1" onClick={handleAddToCart} disabled={product.stock_qty === 0}>
            <i className="fa-solid fa-cart-plus" />
            {product.stock_qty === 0 ? 'Sem estoque' : 'Adicionar'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
