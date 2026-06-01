import { test, expect } from '@fixtures/test';
import { SalesOrderLineService } from '@modules/checkout/services/SalesOrderLineService';

test.describe('Sales Orders API', () => {
  test('@api @functional @checkout sales order can be found by reference', async ({ httpClient }) => {
    const orders = await httpClient.searchRead(
      'sale.order',
      [['state', '=', 'sale']],
      ['id', 'name', 'state', 'amount_total'],
      1,
    );
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0]['state']).toBe('sale');
    expect(orders[0]['name']).toMatch(/^S\d+/);
  });

  test('@api @functional @checkout confirmed sale orders have amount_total > 0', async ({ httpClient }) => {
    const raw = await httpClient.searchRead(
      'sale.order',
      [['state', '=', 'sale']],
      ['id', 'name', 'state', 'amount_total'],
      10,
    );

    expect(raw.length).toBeGreaterThan(0);
    for (const order of raw) {
      expect(order['amount_total']).toBeGreaterThan(0);
      expect(order['state']).toBe('sale');
    }
  });

  test('@api @functional @checkout sale order lines have valid product, qty and price', async ({ httpClient }) => {
    const orders = await httpClient.searchRead(
      'sale.order',
      [['state', '=', 'sale']],
      ['id', 'name'],
      1,
    );
    expect(orders.length).toBeGreaterThan(0);

    const orderId = orders[0]['id'] as number;
    const service  = new SalesOrderLineService(httpClient);
    const lines    = await service.findLinesByOrderId(orderId);

    expect(lines.length).toBeGreaterThan(0);

    // Filter to product lines only (exclude shipping/section lines which have price_unit=0)
    const productLines = lines.filter(l => l.product_id !== false);
    expect(productLines.length).toBeGreaterThan(0);

    for (const line of productLines) {
      expect(line.product_uom_qty).toBeGreaterThan(0);
      expect(line.price_unit).toBeGreaterThanOrEqual(0);
      expect(line.price_subtotal).toBeGreaterThanOrEqual(0);
    }
  });
});

