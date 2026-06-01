import { test, expect } from '../../../src/fixtures/test';
import { PricelistService } from '../../../src/modules/checkout/services/PricelistService';

// Test 9
test('@api @functional @pricelist EUR pricelist exists and uses EUR currency', async ({ httpClient }) => {
  const service   = new PricelistService(httpClient);
  const pricelist = await service.findByName('EUR');

  expect(pricelist).not.toBeNull();
  expect(pricelist!.currency_id[1]).toBe('EUR');
  expect(pricelist!.sequence).toBeGreaterThan(0);
});
