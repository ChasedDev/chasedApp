'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Order } from '@chased/shared';
import { formatBRL } from '@chased/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { useState } from 'react';
import Link from 'next/link';

const STATUS_OPTIONS = ['draft', 'sent', 'confirmed', 'delivered', 'cancelled'] as const;
const STATUS_LABELS: Record<string, { label: string; icon: string; cls: string }> = {
  draft:     { label: 'Rascunho',   icon: 'fa-pencil',       cls: 'bg-slate-100 text-slate-500' },
  sent:      { label: 'Enviado',    icon: 'fa-paper-plane',  cls: 'bg-blue-100 text-blue-600' },
  confirmed: { label: 'Confirmado', icon: 'fa-circle-check', cls: 'bg-green-100 text-green-700' },
  delivered: { label: 'Entregue',   icon: 'fa-truck',        cls: 'bg-brand-100 text-brand-700' },
  cancelled: { label: 'Cancelado',  icon: 'fa-circle-xmark', cls: 'bg-red-100 text-red-500' },
};

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState('');
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: () => fetch('/api/admin/orders').then(r => r.json()),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-orders'] }); toast({ message: 'Status atualizado', type: 'success' }); },
  });

  const filtered = filterStatus ? orders.filter(o => o.status === filterStatus) : orders;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
        <p className="text-sm text-slate-400 mt-0.5">{orders.length} pedido(s) no total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button onClick={() => setFilterStatus('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${!filterStatus ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
          Todos ({orders.length})
        </button>
        {STATUS_OPTIONS.map(s => {
          const count = orders.filter(o => o.status === s).length;
          if (!count) return null;
          const { label, icon } = STATUS_LABELS[s];
          return (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filterStatus === s ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
              <i className={`fa-solid ${icon} text-xs`} />{label} ({count})
            </button>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">ID</th>
                <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Farmácia</th>
                <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Total</th>
                <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Data</th>
                <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(order => {
                const s = STATUS_LABELS[order.status] ?? STATUS_LABELS.draft;
                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4">
                      <span className="font-mono text-xs text-slate-400">#{order.id.slice(0,8).toUpperCase()}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{order.pharmacies?.pharmacy_name ?? '—'}</p>
                      <p className="text-xs text-slate-400">{order.pharmacies?.responsible_name}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{formatBRL(order.total_cents)}</td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4" onClick={e => e.stopPropagation()}>
                      <select value={order.status}
                        onChange={e => updateMutation.mutate({ id: order.id, status: e.target.value })}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${s.cls}`}>
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{STATUS_LABELS[opt].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver detalhes <i className="fa-solid fa-arrow-right text-xs" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.map(order => {
            const s = STATUS_LABELS[order.status] ?? STATUS_LABELS.draft;
            return (
              <div key={order.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-xs text-slate-400">#{order.id.slice(0,8).toUpperCase()}</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{order.pharmacies?.pharmacy_name}</p>
                    <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{formatBRL(order.total_cents)}</p>
                    <span className={`status-badge mt-1 flex items-center gap-1 ${s.cls}`}>
                      <i className={`fa-solid ${s.icon} text-xs`} />{s.label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <select value={order.status}
                    onChange={e => updateMutation.mutate({ id: order.id, status: e.target.value })}
                    className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{STATUS_LABELS[opt].label}</option>
                    ))}
                  </select>
                  <Link href={`/admin/orders/${order.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition-colors">
                    Detalhes <i className="fa-solid fa-arrow-right text-xs" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-2 text-center">
            <i className="fa-solid fa-clipboard-list text-3xl text-slate-200" />
            <p className="text-slate-400 text-sm">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
