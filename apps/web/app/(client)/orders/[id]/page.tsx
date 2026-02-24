'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import type { Order } from '@chased/shared';
import { formatBRL } from '@chased/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OrderSummaryCard } from '@/components/OrderSummaryCard';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => fetch(`/api/orders/${id}`).then(r => r.json()),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!order || !order.id) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-slate-300" />
      <p className="text-slate-500">Pedido não encontrado</p>
      <button onClick={() => router.back()} className="btn-ghost flex items-center gap-2">
        <i className="fa-solid fa-arrow-left" />Voltar
      </button>
    </div>
  );

  return (
    <div className="space-y-4 pb-nav">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <h1 className="text-xl font-bold">Detalhes do pedido</h1>
      </div>

      <OrderSummaryCard order={order} />

      {order.pharmacies && (
        <div className="card p-4 space-y-2">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-hospital text-brand-500" />
            Farmácia
          </h2>
          <p className="text-sm font-medium text-slate-700">{order.pharmacies.pharmacy_name}</p>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <i className="fa-solid fa-user text-xs text-slate-400" />
            {order.pharmacies.responsible_name}
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <i className="fa-brands fa-whatsapp text-xs text-emerald-500" />
            {order.pharmacies.whatsapp}
          </p>
        </div>
      )}

      {order.order_items && order.order_items.length > 0 && (
        <div className="card p-4 space-y-3">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-list text-brand-500" />
            Itens do pedido
          </h2>
          {order.order_items.map(item => (
            <div key={item.id} className="flex justify-between items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0">
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-medium text-sm text-slate-800">{item.product_snapshot.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.product_snapshot.presentation}</p>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded-md font-medium">{item.qty}×</span>
                  {' '}{formatBRL(item.unit_price_cents)}
                </p>
              </div>
              <span className="font-bold text-sm text-slate-900 shrink-0">{formatBRL(item.line_total_cents)}</span>
            </div>
          ))}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span><span>{formatBRL(order.subtotal_cents)}</span>
            </div>
            {order.discount_cents > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Desconto</span><span>-{formatBRL(order.discount_cents)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
              <span>Total</span>
              <span className="text-brand-600">{formatBRL(order.total_cents)}</span>
            </div>
          </div>
        </div>
      )}

      {order.notes && (
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
            <i className="fa-solid fa-note-sticky text-brand-500" />
            Observações
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{order.notes}</p>
        </div>
      )}

      <div className="card p-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
          <i className="fa-brands fa-whatsapp text-emerald-500" />
          Mensagem enviada
        </h2>
        <pre className="text-xs text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded-2xl font-mono leading-relaxed overflow-auto max-h-60">
          {order.whatsapp_message}
        </pre>
      </div>
    </div>
  );
}
