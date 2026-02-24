'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product } from '@chased/shared';
import { formatBRL } from '@chased/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { useToast } from '@/lib/hooks/useToast';
import { useState } from 'react';

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: () => fetch('/api/admin/products').then(r => r.json()),
  });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand ?? '').toLowerCase().includes(search.toLowerCase()) ||
    p.presentation.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMutation = useMutation({
    mutationFn: (p: Product) => fetch(`/api/admin/products/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !p.active }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast({ message: 'Produto atualizado', type: 'success' }); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast({ message: 'Produto removido', type: 'info' }); },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
          <p className="text-sm text-slate-400 mt-0.5">{products.length} produtos cadastrados</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm">
          <i className="fa-solid fa-plus" />
          <span className="hidden sm:inline">Novo produto</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
        <input type="search" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, marca, apresentação..." className="input-base pl-10" />
      </div>

      {/* Table / Cards */}
      <div className="card overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left p-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">Produto</th>
                <th className="text-left p-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">Preço</th>
                <th className="text-left p-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">Estoque</th>
                <th className="text-left p-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.brand} · {p.presentation}</p>
                  </td>
                  <td className="p-4 font-bold text-slate-700">{formatBRL(p.price_cents)}</td>
                  <td className="p-4">
                    <span className={`font-semibold ${p.stock_qty === 0 ? 'text-red-500' : p.stock_qty < 10 ? 'text-amber-500' : 'text-slate-700'}`}>
                      {p.stock_qty}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3 justify-end">
                      <Link href={`/admin/products/${p.id}/edit`} className="text-brand-600 hover:underline text-xs font-medium">Editar</Link>
                      <button onClick={() => toggleMutation.mutate(p)} className="text-amber-500 hover:underline text-xs font-medium">{p.active ? 'Desativar' : 'Ativar'}</button>
                      <button onClick={() => { if (confirm('Remover produto?')) deleteMutation.mutate(p.id); }} className="text-red-400 hover:underline text-xs font-medium">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.map(p => (
            <div key={p.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.presentation}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {p.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-600">{formatBRL(p.price_cents)} <span className="text-slate-400 font-normal text-xs">· {p.stock_qty} un.</span></span>
                <div className="flex gap-3 text-xs">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-brand-600 font-medium">Editar</Link>
                  <button onClick={() => toggleMutation.mutate(p)} className="text-amber-500 font-medium">{p.active ? 'Desativar' : 'Ativar'}</button>
                  <button onClick={() => { if (confirm('Remover?')) deleteMutation.mutate(p.id); }} className="text-red-400 font-medium">Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-10 text-slate-400 text-sm">
            {search ? `Nenhum produto encontrado para "${search}"` : 'Nenhum produto cadastrado'}
          </p>
        )}
      </div>
    </div>
  );
}
