import type { Order } from '@chased/shared';
import { formatBRL } from '@chased/shared';

const STATUS: Record<string, { label: string; icon: string; cls: string }> = {
  draft:     { label: 'Rascunho',   icon: 'fa-pencil',        cls: 'bg-slate-100 text-slate-600' },
  sent:      { label: 'Enviado',    icon: 'fa-paper-plane',   cls: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'Confirmado', icon: 'fa-circle-check',  cls: 'bg-green-100 text-green-700' },
  delivered: { label: 'Entregue',   icon: 'fa-truck',         cls: 'bg-brand-100 text-brand-700' },
  cancelled: { label: 'Cancelado',  icon: 'fa-circle-xmark',  cls: 'bg-red-100 text-red-600' },
};

export function OrderSummaryCard({ order }: { order: Order }) {
  const s = STATUS[order.status] ?? STATUS.draft;
  return (
    <div className="card p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-mono text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            <i className="fa-regular fa-calendar mr-1" />
            {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <span className={`status-badge flex items-center gap-1.5 ${s.cls}`}>
          <i className={`fa-solid ${s.icon} text-xs`} />{s.label}
        </span>
      </div>
      <div className="flex justify-between items-center border-t border-slate-100 pt-3">
        <span className="text-sm text-slate-500">Total do pedido</span>
        <span className="font-bold text-xl text-brand-600">{formatBRL(order.total_cents)}</span>
      </div>
    </div>
  );
}
