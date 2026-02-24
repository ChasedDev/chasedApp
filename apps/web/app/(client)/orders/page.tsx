'use client';
import { useQuery } from '@tanstack/react-query';
import type { Order } from '@chased/shared';
import { formatBRL } from '@chased/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

const STATUS: Record<string, { label: string; icon: string; cls: string }> = {
  draft:     { label: 'Rascunho',   icon: 'fa-pencil',       cls: 'bg-slate-100 text-slate-500' },
  sent:      { label: 'Enviado',    icon: 'fa-paper-plane',  cls: 'bg-blue-100 text-blue-600' },
  confirmed: { label: 'Confirmado', icon: 'fa-check',        cls: 'bg-green-100 text-green-700' },
  delivered: { label: 'Entregue',   icon: 'fa-truck',        cls: 'bg-brand-100 text-brand-700' },
  cancelled: { label: 'Cancelado',  icon: 'fa-xmark',        cls: 'bg-red-100 text-red-500' },
};

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => fetch('/api/orders').then(r => r.json()),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 pb-nav">
      <h1 className="text-xl font-bold pt-2">Meus pedidos</h1>
      {orders.length === 0 ? (
        <EmptyState message="Nenhum pedido ainda" description="Faça seu primeiro pedido pelo carrinho" icon="fa-clipboard-list" action={{ label: 'Ver produtos', href: '/' }} />
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const s = STATUS[order.status] ?? STATUS.draft;
            return (
              <Link key={order.id} href={`/orders/${order.id}`} className="card p-4 flex justify-between items-center hover:shadow-elevated transition-all block">
                <div>
                  <p className="font-mono text-xs text-slate-400">#{order.id.slice(0,8).toUpperCase()}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <span className={`status-badge flex items-center gap-1.5 mt-1.5 w-fit ${s.cls}`}>
                    <i className={`fa-solid ${s.icon} text-xs`} />{s.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-brand-600">{formatBRL(order.total_cents)}</span>
                  <i className="fa-solid fa-chevron-right text-slate-300 text-sm" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
