import { test, expect } from '../../../src/fixtures/test';
import { ProductApiService } from '../../../src/modules/catalog/services/ProductApiService';

// Test 1
test('@api @smoke @catalog purchasable products can be queried', async ({ httpClient }) => {
  const service  = new ProductApiService(httpClient);
  const products = await service.findPurchasableProducts();
  expect(products.length).toBeGreaterThan(0);
});

// Test 2
test('@api @functional @catalog purchasable products have required fields and list_price > 0', async ({ httpClient }) => {
  const service = new ProductApiService(httpClient);
  const products = await service.findPurchasableProducts();

  expect(products.length).toBeGreaterThan(0);
  for (const product of products) {
    expect(product.id).toBeGreaterThan(0);
    expect(product.name.length).toBeGreaterThan(0);
    expect(product.list_price).toBeGreaterThan(0);
    expect(product.sale_ok).toBe(true);
  }
});

// Test 3
test('@api @functional @catalog published products are a subset of purchasable products', async ({ httpClient }) => {
  const service = new ProductApiService(httpClient);
  const published  = await service.findPublishedProducts();
  const purchasable = await service.findPurchasableProducts();

  expect(purchasable.length).toBeGreaterThan(0);

  const purchasableIds = new Set(purchasable.map(p => p.id));
  for (const p of published) {
    expect(purchasableIds.has(p.id)).toBe(true);
  }
});

