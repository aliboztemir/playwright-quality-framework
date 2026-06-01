import { test, expect } from '@fixtures/test';
import { PricelistService } from '@modules/checkout/services/PricelistService';

test.describe('@pricelist Pricelists API', () => {
  test('@API-PRC-001 @api @functional @pricelist EUR pricelist exists with correct currency', async ({ httpClient }) => {
    const service   = new PricelistService(httpClient);
    const pricelist = await service.findByName('EUR');

    expect(pricelist).not.toBeNull();
    expect(pricelist!.currency_id[1]).toBe('EUR');
    expect(pricelist!.sequence).toBeGreaterThan(0);
  });
});

