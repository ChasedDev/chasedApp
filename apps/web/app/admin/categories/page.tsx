'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category } from '@chased/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useToast } from '@/lib/hooks/useToast';
import { useState } from 'react';

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [newName, setNewName] = useState('');
  const { data: categories = [], isLoading } = useQuery<Category[]>({ queryKey: ['admin-categories'], queryFn: () => fetch('/api/admin/categories').then(r => r.json()) });
  const createMutation = useMutation({
    mutationFn: (name: string) => fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, active: true }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setNewName(''); toast({ message: 'Categoria criada!', type: 'success' }); },
  });
  const toggleMutation = useMutation({
    mutationFn: (c: Category) => fetch(`/api/admin/categories/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !c.active }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); toast({ message: 'Categoria removida', type: 'info' }); },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-2xl font-bold">Categorias</h1>
      <div className="flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome da categoria" className="input-base flex-1" />
        <PrimaryButton onClick={() => newName && createMutation.mutate(newName)} loading={createMutation.isPending}>Criar</PrimaryButton>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
        {categories.map(c => (
          <div key={c.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${c.active ? 'bg-green-400' : 'bg-gray-300'}`} />
              <span className="font-medium">{c.name}</span>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => toggleMutation.mutate(c)} className="text-yellow-500 hover:underline">{c.active ? 'Desativar' : 'Ativar'}</button>
              <button onClick={() => confirm('Remover?') && deleteMutation.mutate(c.id)} className="text-red-400 hover:underline">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
