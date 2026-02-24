import { useCartStore } from '@/lib/store/cartStore';

export function useCartTotal() {
  const items = useCartStore(s => s.items);
  const subtotal = items.reduce((s, i) => s + i.price_cents * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  return { subtotal, itemCount };
}
