'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Category, Product } from '@chased/shared';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then(r => r.json()),
  });
  const category = categories.find(c => c.id === id);
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', id],
    queryFn: () => fetch(`/api/products?categoryId=${id}`).then(r => r.json()),
    enabled: !!id,
  });

  return (
    <div className="space-y-4 pb-nav">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <h1 className="text-xl font-bold">{category?.name ?? 'Categoria'}</h1>
      </div>
      {isLoading ? <LoadingSpinner /> : products.length === 0 ? (
        <EmptyState message="Nenhum produto nesta categoria" icon="fa-box-open" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
