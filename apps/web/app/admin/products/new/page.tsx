'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema } from '@chased/shared';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { Category } from '@chased/shared';
import { FormField } from '@/components/ui/FormField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useToast } from '@/lib/hooks/useToast';
import { useRouter } from 'next/navigation';

type ProductForm = z.infer<typeof ProductSchema>;

export default function NewProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then(r => r.json()),
  });
  const { register, handleSubmit, control, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(ProductSchema),
    defaultValues: { active: true, stock_qty: 0 },
  });
  const mutation = useMutation({
    mutationFn: (data: ProductForm) => fetch('/api/admin/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    }).then(r => r.json()),
    onSuccess: () => { toast({ message: 'Produto criado!', type: 'success' }); router.push('/admin/products'); },
    onError: () => toast({ message: 'Erro ao criar produto', type: 'error' }),
  });

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <h1 className="text-xl font-bold">Novo produto</h1>
      </div>

      <div className="card p-5">
        <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4">
          <FormField label="Foto do produto">
            <Controller name="image_url" control={control}
              render={({ field }) => (
                <ImageUpload value={field.value} onChange={field.onChange} folder="img" />
              )} />
          </FormField>

          <FormField label="Categoria" error={errors.category_id?.message}>
            <select {...register('category_id')} className="input-base">
              <option value="">Selecione...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>

          <FormField label="Nome" error={errors.name?.message}>
            <input {...register('name')} className="input-base" placeholder="Ex: Paracetamol" />
          </FormField>

          <FormField label="Marca" error={errors.brand?.message}>
            <input {...register('brand')} className="input-base" placeholder="Ex: Genérico" />
          </FormField>

          <FormField label="Apresentação" error={errors.presentation?.message}>
            <input {...register('presentation')} className="input-base" placeholder="Ex: 500mg, 20 comprimidos" />
          </FormField>

          <FormField label="Descrição" error={errors.description?.message}>
            <textarea {...register('description')} className="input-base" rows={3} placeholder="Descrição do produto..." />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Preço (centavos)" error={errors.price_cents?.message} hint="Ex: 1990 = R$ 19,90">
              <input {...register('price_cents', { valueAsNumber: true })} type="number" min="1" className="input-base" placeholder="1990" />
            </FormField>
            <FormField label="Estoque" error={errors.stock_qty?.message}>
              <input {...register('stock_qty', { valueAsNumber: true })} type="number" min="0" className="input-base" placeholder="0" />
            </FormField>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
            <input {...register('active')} type="checkbox" id="active" className="w-4 h-4 accent-brand-600 rounded" defaultChecked />
            <label htmlFor="active" className="text-sm font-medium text-slate-700">Produto ativo (visível no catálogo)</label>
          </div>

          <PrimaryButton type="submit" loading={mutation.isPending} className="w-full">
            <i className="fa-solid fa-plus" />Criar produto
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
