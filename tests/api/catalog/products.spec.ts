import { test, expect } from '@fixtures/test';
import { ProductApiService } from '@modules/catalog/services/ProductApiService';

test.describe('@catalog Catalog API', () => {
  test('@API-CAT-001 @api @smoke @catalog purchasable products can be queried from the API', async ({ httpClient }) => {
    const service  = new ProductApiService(httpClient);
    const products = await service.findPurchasableProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  test('@API-CAT-002 @api @functional @catalog purchasable products have required fields and positive price', async ({ httpClient }) => {
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

  test('@API-CAT-003 @api @functional @catalog published products are a subset of purchasable products', async ({ httpClient }) => {
    const service = new ProductApiService(httpClient);
    const published   = await service.findPublishedProducts();
    const purchasable = await service.findPurchasableProducts();

    expect(purchasable.length).toBeGreaterThan(0);

    const purchasableIds = new Set(purchasable.map(p => p.id));
    for (const p of published) {
      expect(purchasableIds.has(p.id)).toBe(true);
    }
  });
});

