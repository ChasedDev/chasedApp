import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@chased/shared';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string) => void;
  updateQty: (product_id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(i => i.product_id === item.product_id);
        if (existing) {
          set({ items: get().items.map(i => i.product_id === item.product_id ? { ...i, qty: Math.min(i.qty + item.qty, i.stock_qty) } : i) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (product_id) => set({ items: get().items.filter(i => i.product_id !== product_id) }),
      updateQty: (product_id, qty) => {
        if (qty <= 0) { get().removeItem(product_id); return; }
        set({ items: get().items.map(i => i.product_id === product_id ? { ...i, qty: Math.min(qty, i.stock_qty) } : i) });
      },
      clearCart: () => set({ items: [] }),
    }),
    { name: 'chased-cart' }
  )
);
