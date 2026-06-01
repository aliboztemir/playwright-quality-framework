import { expect } from '@playwright/test';
import type { CartItem } from '../models/CartItem';

export function assertCartTotalsConsistent(items: CartItem[]): void {
  for (const item of items) {
    const expected = item.unitPrice * item.quantity;
    expect(Math.abs(item.subtotal - expected)).toBeLessThanOrEqual(0.01);
  }
}
