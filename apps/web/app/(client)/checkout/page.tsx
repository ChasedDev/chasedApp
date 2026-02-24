'use client';
import { useState } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { useCartTotal } from '@/lib/hooks/useCart';
import { formatBRL } from '@chased/shared';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/lib/hooks/useToast';
import { useRouter } from 'next/navigation';
import { postEvent } from '@/lib/api';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { subtotal } = useCartTotal();
  const { toast } = useToast();
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [orderResult, setOrderResult] = useState<{ order_id: string; whatsapp_url: string; whatsapp_message: string } | null>(null);

  if (items.length === 0 && !orderResult) { router.push('/cart'); return null; }

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(i => ({ product_id: i.product_id, qty: i.qty })), notes: notes || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao criar pedido');
      setOrderResult(json);
      postEvent('order_created', { order_id: json.order_id });
    } catch (err: unknown) {
      toast({ message: (err as Error).message, type: 'error' });
    } finally { setLoading(false); }
  };

  const handleSend = async () => {
    if (!orderResult) return;
    setSending(true);
    window.open(orderResult.whatsapp_url, '_blank');
    try {
      await fetch(`/api/orders/${orderResult.order_id}/send`, { method: 'POST' });
      clearCart();
      postEvent('whatsapp_opened', { order_id: orderResult.order_id });
      toast({ message: 'Pedido enviado!', type: 'success' });
      router.push(`/orders/${orderResult.order_id}`);
    } catch {
      toast({ message: 'Erro ao registrar envio', type: 'error' });
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-4 pb-nav">
      <h1 className="text-xl font-bold pt-2">Checkout</h1>

      {!orderResult ? (
        <>
          <div className="card p-4 space-y-3">
            <h2 className="font-semibold text-slate-800">Resumo do pedido</h2>
            {items.map(item => (
              <div key={item.product_id} className="flex justify-between text-sm">
                <span className="text-slate-600 flex-1 truncate mr-4">{item.name} <span className="text-slate-400">×{item.qty}</span></span>
                <span className="font-semibold text-slate-800 shrink-0">{formatBRL(item.price_cents * item.qty)}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-brand-600">{formatBRL(subtotal)}</span>
            </div>
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <i className="fa-solid fa-note-sticky mr-1.5 text-slate-400" />
              Observações (opcional)
            </label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} maxLength={500}
              placeholder="Ex: entregar terça-feira, embalagem especial..." className="input-base resize-none" />
            <p className="text-xs text-slate-400 mt-1 text-right">{notes.length}/500</p>
          </div>

          <PrimaryButton className="w-full" size="lg" onClick={handleCreateOrder} loading={loading}>
            <i className="fa-solid fa-file-invoice" />
            Gerar pedido
          </PrimaryButton>
        </>
      ) : (
        <>
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex gap-3">
            <i className="fa-solid fa-circle-check text-emerald-500 text-xl mt-0.5" />
            <div>
              <p className="font-bold text-emerald-800">Pedido gerado!</p>
              <p className="text-sm text-emerald-700 mt-0.5">Clique em enviar para abrir o WhatsApp com a mensagem pronta.</p>
            </div>
          </div>

          <div className="card p-4">
            <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <i className="fa-brands fa-whatsapp text-emerald-500" />
              Prévia da mensagem
            </h2>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded-2xl font-mono leading-relaxed overflow-auto max-h-64">{orderResult.whatsapp_message}</pre>
          </div>

          <PrimaryButton className="w-full bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" size="lg" onClick={handleSend} loading={sending}>
            <i className="fa-brands fa-whatsapp text-xl" />
            Enviar via WhatsApp
          </PrimaryButton>
        </>
      )}
    </div>
  );
}
