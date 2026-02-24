'use client';
import { useQuery } from '@tanstack/react-query';
import { PromoCarousel } from '@/components/PromoCarousel';
import { CategoryChip } from '@/components/CategoryChip';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Category, Product, PromoBanner } from '@chased/shared';
import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: promos = [] } = useQuery<PromoBanner[]>({
    queryKey: ['promos'],
    queryFn: () => fetch('/api/promos').then(r => r.json()),
  });
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then(r => r.json()),
  });
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('categoryId', selectedCategory);
      return fetch(`/api/products?${params}`).then(r => r.json());
    },
  });

  return (
    <div className="space-y-5 pb-nav">
      {promos.length > 0 && <div className="mx-0"><PromoCarousel promos={promos} /></div>}

      <section>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          <CategoryChip label="Todos" active={!selectedCategory} onClick={() => setSelectedCategory(null)} icon="fa-border-all" />
          {categories.map(cat => (
            <CategoryChip key={cat.id} label={cat.name} active={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id)} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-900">
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Todos os produtos'}
            {!isLoading && <span className="text-sm font-normal text-slate-400 ml-2">({products.length})</span>}
          </h2>
          <Link href="/search" className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:underline">
            <i className="fa-solid fa-magnifying-glass text-xs" />Buscar
          </Link>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </div>
  );
}
