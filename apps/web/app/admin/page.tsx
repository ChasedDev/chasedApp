'use client';
import { useQuery } from '@tanstack/react-query';
import type { Order } from '@chased/shared';
import { formatBRL } from '@chased/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import clsx from 'clsx';

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Rascunho',   cls: 'bg-slate-100 text-slate-500' },
  sent:      { label: 'Enviado',    cls: 'bg-blue-100 text-blue-600' },
  confirmed: { label: 'Confirmado', cls: 'bg-green-100 text-green-700' },
  delivered: { label: 'Entregue',   cls: 'bg-brand-100 text-brand-700' },
  cancelled: { label: 'Cancelado',  cls: 'bg-red-100 text-red-500' },
};

export default function AdminDashboard() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: () => fetch('/api/admin/orders').then(r => r.json()),
  });

  if (isLoading) return <LoadingSpinner />;

  const totalRevenue = orders.reduce((s, o) => s + o.total_cents, 0);
  const sentOrders = orders.filter(o => ['sent','confirmed','delivered'].includes(o.status)).length;
  const pendingOrders = orders.filter(o => o.status === 'sent').length;

  const stats = [
    { label: 'Total pedidos', value: orders.length, icon: 'fa-clipboard-list', color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Enviados',      value: sentOrders,    icon: 'fa-paper-plane',    color: 'text-blue-600',  bg: 'bg-blue-50' },
    { label: 'Aguardando',    value: pendingOrders,  icon: 'fa-clock',          color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Receita total', value: formatBRL(totalRevenue), icon: 'fa-money-bill-wave', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Visão geral da operação</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className={clsx('w-10 h-10 rounded-2xl flex items-center justify-center', stat.bg)}>
              <i className={clsx('fa-solid', stat.icon, stat.color, 'text-sm')} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <p className={clsx('font-bold text-xl mt-0.5', stat.color)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Pedidos recentes</h2>
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:underline font-medium flex items-center gap-1">
            Ver todos <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-2">
            <i className="fa-solid fa-clipboard-list text-3xl text-slate-200" />
            <p className="text-slate-400 text-sm">Nenhum pedido ainda</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {orders.slice(0, 8).map(order => {
              const s = STATUS_LABELS[order.status] ?? STATUS_LABELS.draft;
              return (
                <Link href={`/admin/orders/${order.id}`} key={order.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                  <span className="font-mono text-xs text-slate-400 w-20 shrink-0">
                    #{order.id.slice(0,8).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {order.pharmacies?.pharmacy_name ?? '—'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={clsx('text-xs px-2 py-1 rounded-full font-semibold hidden sm:inline-flex', s.cls)}>
                      {s.label}
                    </span>
                    <span className="font-bold text-sm text-slate-800">{formatBRL(order.total_cents)}</span>
                    <i className="fa-solid fa-chevron-right text-slate-200 text-xs group-hover:text-brand-400 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
