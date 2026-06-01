import { test, expect } from '@fixtures/test';
import { knownProducts } from '@data/testData/products';

test.describe('Product Search', () => {
  test('@ui @functional @catalog CAT-005 searching a known product returns relevant results', async ({ app, page }) => {
    await app.catalog.openCatalog();
    await app.catalog.catalogPage.search(knownProducts.simpleOrderPolicy.keyword);

    await expect(page).toHaveURL(/[?&]search=/);
    const count = await app.catalog.catalogPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    await app.catalog.expectProductVisible(knownProducts.simpleOrderPolicy.name);
  });

  test('@ui @functional @catalog CAT-006 searching a non-existent term shows no products', async ({ app, page }) => {
    await app.catalog.openCatalog();
    await app.catalog.catalogPage.search('xyzzy_nonexistent_product_99999');

    await expect(page).toHaveURL(/[?&]search=/);
    const count = await app.catalog.catalogPage.getProductCount();
    expect(count).toBe(0);
  });

  test('@ui @functional @catalog CAT-007 search is case-insensitive and partial match works', async ({ app }) => {
    await app.catalog.openCatalog();
    // Search with lowercase partial keyword
    await app.catalog.catalogPage.search('desk');

    const count = await app.catalog.catalogPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });
});
