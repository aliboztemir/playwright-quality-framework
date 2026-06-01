import { test, expect } from '@fixtures/test';
import { PricelistService } from '@modules/checkout/services/PricelistService';

test.describe('Pricelists API', () => {
  test('@api @functional @pricelist EUR pricelist exists and uses EUR currency', async ({ httpClient }) => {
    const service   = new PricelistService(httpClient);
    const pricelist = await service.findByName('EUR');

    expect(pricelist).not.toBeNull();
    expect(pricelist!.currency_id[1]).toBe('EUR');
    expect(pricelist!.sequence).toBeGreaterThan(0);
  });
});

