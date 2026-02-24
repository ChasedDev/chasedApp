'use client';
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Product } from '@chased/shared';

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (val: string) => {
    setSearch(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  };

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products-search', debouncedSearch],
    queryFn: () => fetch(`/api/products?search=${encodeURIComponent(debouncedSearch)}`).then(r => r.json()),
    enabled: debouncedSearch.length >= 1,
  });

  return (
    <div className="space-y-4 pb-nav">
      <div className="relative pt-2">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 translate-y-[3px] text-slate-400 text-sm pointer-events-none" />
        <input type="search" value={search} onChange={e => handleSearch(e.target.value)}
          placeholder="Buscar por nome, marca..." className="input-base pl-10" autoFocus />
      </div>

      {debouncedSearch && (
        isLoading ? <LoadingSpinner size="sm" /> :
        products.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-2">
            <i className="fa-solid fa-magnifying-glass text-3xl text-slate-200" />
            <p className="text-slate-500 font-medium">Sem resultados para "{debouncedSearch}"</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400">{products.length} resultado(s)</p>
            <div className="grid grid-cols-2 gap-3">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )
      )}

      {!debouncedSearch && (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
            <i className="fa-solid fa-magnifying-glass text-2xl text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">Busque por produtos</p>
          <p className="text-slate-400 text-sm">Digite o nome, marca ou apresentação</p>
        </div>
      )}
    </div>
  );
}
