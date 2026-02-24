'use client';
import { useCartStore } from '@/lib/store/cartStore';
import { formatBRL } from '@chased/shared';
import { QuantitySelector } from '@/components/QuantitySelector';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/lib/hooks/useToast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartTotal } from '@/lib/hooks/useCart';
import { postEvent } from '@/lib/api';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const { subtotal } = useCartTotal();
  const { toast } = useToast();
  const router = useRouter();

  if (items.length === 0) return (
    <EmptyState message="Carrinho vazio" description="Adicione produtos para fazer seu pedido" icon="fa-cart-shopping" action={{ label: 'Ver produtos', href: '/' }} />
  );

  return (
    <div className="space-y-4 pb-nav">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-xl font-bold">Carrinho <span className="text-slate-400 font-normal text-base">({items.length})</span></h1>
        <button onClick={() => clearCart()} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
          <i className="fa-solid fa-trash text-xs" />Limpar
        </button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.product_id} className="card p-3 flex gap-3">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <i className="fa-solid fa-pills text-2xl text-slate-200" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900 truncate">{item.name}</p>
              <p className="text-xs text-slate-400">{item.presentation}</p>
              <p className="text-brand-600 font-bold text-sm mt-1">{formatBRL(item.price_cents)}</p>
              <div className="flex items-center justify-between mt-2">
                <QuantitySelector value={item.qty} onChange={qty => updateQty(item.product_id, qty)} min={1} max={item.stock_qty} compact />
                <button onClick={() => { removeItem(item.product_id); postEvent('remove_from_cart', { product_id: item.product_id }); toast({ message: 'Removido', type: 'info' }); }}
                  className="text-slate-300 hover:text-red-400 transition-colors">
                  <i className="fa-solid fa-trash text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 space-y-2">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Subtotal ({items.reduce((s,i) => s+i.qty, 0)} itens)</span>
          <span className="font-semibold text-slate-700">{formatBRL(subtotal)}</span>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <i className="fa-solid fa-circle-info" />Frete e descontos calculados pelo representante
        </p>
      </div>

      <PrimaryButton className="w-full" size="lg"
        onClick={() => { postEvent('checkout_start', { item_count: items.length, subtotal }); router.push('/checkout'); }}>
        <i className="fa-brands fa-whatsapp text-lg" />
        Finalizar via WhatsApp · {formatBRL(subtotal)}
      </PrimaryButton>
    </div>
  );
}
