'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import type { Order } from '@chased/shared';
import { formatBRL } from '@chased/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';

const STATUS_OPTIONS = ['draft', 'sent', 'confirmed', 'delivered', 'cancelled'] as const;
const STATUS_LABELS: Record<string, { label: string; icon: string; cls: string }> = {
  draft:     { label: 'Rascunho',   icon: 'fa-pencil',       cls: 'bg-slate-100 text-slate-500' },
  sent:      { label: 'Enviado',    icon: 'fa-paper-plane',  cls: 'bg-blue-100 text-blue-600' },
  confirmed: { label: 'Confirmado', icon: 'fa-circle-check', cls: 'bg-green-100 text-green-700' },
  delivered: { label: 'Entregue',   icon: 'fa-truck',        cls: 'bg-brand-100 text-brand-700' },
  cancelled: { label: 'Cancelado',  icon: 'fa-circle-xmark', cls: 'bg-red-100 text-red-500' },
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['admin-order', id],
    queryFn: () => fetch(`/api/orders/${id}`).then(r => r.json()),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (status: string) => fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-order', id] });
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ message: 'Status atualizado!', type: 'success' });
    },
  });

  if (isLoading) return <div className="max-w-2xl mx-auto"><LoadingSpinner /></div>;
  if (!order?.id) return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-slate-300" />
      <p className="text-slate-500">Pedido não encontrado</p>
      <button onClick={() => router.back()} className="btn-ghost flex items-center gap-2 text-sm">
        <i className="fa-solid fa-arrow-left" /> Voltar
      </button>
    </div>
  );

  const s = STATUS_LABELS[order.status] ?? STATUS_LABELS.draft;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors shrink-0">
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Detalhes do pedido</h1>
          <p className="text-xs font-mono text-slate-400">#{order.id.toUpperCase()}</p>
        </div>
        <span className={`status-badge flex items-center gap-1.5 shrink-0 ${s.cls}`}>
          <i className={`fa-solid ${s.icon} text-xs`} />{s.label}
        </span>
      </div>

      {/* Status updater */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Atualizar status</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(opt => {
            const sl = STATUS_LABELS[opt];
            const isActive = order.status === opt;
            return (
              <button key={opt} onClick={() => updateMutation.mutate(opt)} disabled={isActive || updateMutation.isPending}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:cursor-default ${isActive ? sl.cls + ' ring-2 ring-offset-1 ring-current' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                <i className={`fa-solid ${sl.icon} text-xs`} />{sl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pharmacy info */}
      {order.pharmacies && (
        <div className="card p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Farmácia</p>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-hospital text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{order.pharmacies.pharmacy_name}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <i className="fa-solid fa-user text-xs text-slate-400" />{order.pharmacies.responsible_name}
              </p>
              {order.pharmacies.whatsapp && (
                <a href={`https://wa.me/${order.pharmacies.whatsapp}`} target="_blank"
                  className="text-sm text-emerald-600 flex items-center gap-1.5 mt-0.5 hover:underline">
                  <i className="fa-brands fa-whatsapp" />{order.pharmacies.whatsapp}
                </a>
              )}
              {order.pharmacies.address_line1 && (
                <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <i className="fa-solid fa-location-dot text-xs" />
                  {order.pharmacies.address_line1}, {order.pharmacies.city}-{order.pharmacies.state}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order items */}
      {order.order_items && order.order_items.length > 0 && (
        <div className="card p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Itens do pedido <span className="normal-case font-normal">({order.order_items.length} produto(s))</span>
          </p>
          <div className="space-y-3">
            {order.order_items.map((item, i) => (
              <div key={item.id} className="flex justify-between items-start gap-4 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{item.product_snapshot?.name ?? '—'}</p>
                    <p className="text-xs text-slate-400">{item.product_snapshot?.presentation}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded-md font-mono">{item.qty}×</span>
                      {' '}{formatBRL(item.unit_price_cents)} cada
                    </p>
                  </div>
                </div>
                <p className="font-bold text-sm text-slate-900 shrink-0">{formatBRL(item.line_total_cents)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span><span>{formatBRL(order.subtotal_cents)}</span>
            </div>
            {order.discount_cents > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Desconto</span><span>-{formatBRL(order.discount_cents)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
              <span>Total</span>
              <span className="text-brand-600 text-xl">{formatBRL(order.total_cents)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="card p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Observações</p>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-2xl px-4 py-3">{order.notes}</p>
        </div>
      )}

      {/* Timeline */}
      <div className="card p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Linha do tempo</p>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <i className="fa-regular fa-calendar text-xs text-slate-400 w-4 text-center" />
          Criado em {new Date(order.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        {order.sent_at && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <i className="fa-brands fa-whatsapp text-xs text-emerald-500 w-4 text-center" />
            Enviado via WhatsApp em {new Date(order.sent_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {/* WhatsApp message */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Mensagem WhatsApp</p>
        <pre className="text-xs text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl font-mono leading-relaxed overflow-auto max-h-64">
          {order.whatsapp_message}
        </pre>
      </div>
    </div>
  );
}
