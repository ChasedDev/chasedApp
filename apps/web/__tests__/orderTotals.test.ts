import { describe, it, expect } from 'vitest';
import { calculateOrderTotals } from '@chased/shared';

describe('calculateOrderTotals', () => {
  it('calculates subtotal correctly', () => {
    const items = [{ unit_price_cents: 1000, qty: 2 }, { unit_price_cents: 500, qty: 3 }];
    const result = calculateOrderTotals(items);
    expect(result.subtotal_cents).toBe(3500);
    expect(result.discount_cents).toBe(0);
    expect(result.total_cents).toBe(3500);
  });
  it('applies discount correctly', () => {
    const items = [{ unit_price_cents: 10000, qty: 1 }];
    const result = calculateOrderTotals(items, 500);
    expect(result.subtotal_cents).toBe(10000);
    expect(result.discount_cents).toBe(500);
    expect(result.total_cents).toBe(9500);
  });
  it('total never goes below zero', () => {
    const result = calculateOrderTotals([{ unit_price_cents: 100, qty: 1 }], 500);
    expect(result.total_cents).toBe(0);
  });
  it('handles empty items', () => {
    const result = calculateOrderTotals([]);
    expect(result.subtotal_cents).toBe(0);
    expect(result.total_cents).toBe(0);
  });
  it('handles single item', () => {
    const result = calculateOrderTotals([{ unit_price_cents: 1990, qty: 1 }]);
    expect(result.subtotal_cents).toBe(1990);
    expect(result.total_cents).toBe(1990);
  });
});
