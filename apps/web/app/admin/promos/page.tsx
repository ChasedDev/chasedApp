'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PromoBanner } from '@chased/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PromoSchema } from '@chased/shared';
import { z } from 'zod';
import { FormField } from '@/components/ui/FormField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

type PromoForm = z.infer<typeof PromoSchema>;

export default function AdminPromosPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: promos = [], isLoading } = useQuery<PromoBanner[]>({ queryKey: ['admin-promos'], queryFn: () => fetch('/api/admin/promos').then(r => r.json()) });
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PromoForm>({ resolver: zodResolver(PromoSchema), defaultValues: { link_type: 'none', active: true, sort_order: 0 } });
  const createMutation = useMutation({
    mutationFn: (data: PromoForm) => fetch('/api/admin/promos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-promos'] }); reset(); toast({ message: 'Banner criado!', type: 'success' }); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/promos/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-promos'] }),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Banners promocionais</h1>
      <form onSubmit={handleSubmit(d => createMutation.mutate(d))} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-semibold">Novo banner</h2>
        <FormField label="Título" error={errors.title?.message}><input {...register('title')} className="input-base" /></FormField>
        <FormField label="Subtítulo" error={errors.subtitle?.message}><input {...register('subtitle')} className="input-base" /></FormField>
        <FormField label="URL da imagem" error={errors.image_url?.message}><input {...register('image_url')} type="url" className="input-base" /></FormField>
        <FormField label="Tipo de link" error={errors.link_type?.message}><select {...register('link_type')} className="input-base"><option value="none">Nenhum</option><option value="category">Categoria</option><option value="product">Produto</option></select></FormField>
        <FormField label="Ordem" error={errors.sort_order?.message}><input {...register('sort_order', { valueAsNumber: true })} type="number" className="input-base" /></FormField>
        <PrimaryButton type="submit" loading={createMutation.isPending} className="w-full">Criar banner</PrimaryButton>
      </form>
      <div className="space-y-3">
        {promos.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
            <div><p className="font-medium">{p.title}</p><p className="text-xs text-gray-500">{p.subtitle}</p></div>
            <button onClick={() => confirm('Excluir banner?') && deleteMutation.mutate(p.id)} className="text-red-400 text-sm hover:underline">Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
