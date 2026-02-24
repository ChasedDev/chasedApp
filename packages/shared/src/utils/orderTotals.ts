export interface OrderItem {
  unit_price_cents: number;
  qty: number;
}

export interface OrderTotals {
  subtotal_cents: number;
  discount_cents: number;
  total_cents: number;
}

export function calculateOrderTotals(items: OrderItem[], discount_cents = 0): OrderTotals {
  const subtotal_cents = items.reduce((sum, item) => sum + item.unit_price_cents * item.qty, 0);
  const total_cents = Math.max(0, subtotal_cents - discount_cents);
  return { subtotal_cents, discount_cents, total_cents };
}
