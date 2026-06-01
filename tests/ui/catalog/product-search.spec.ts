import { test, expect } from '@fixtures/test';
import { knownProducts } from '@data/testData/products';

test.describe('@catalog Product Search', () => {
  test('@CAT-005 @ui @functional @catalog searching a known keyword returns relevant results', async ({ app, page }) => {
    await app.catalog.openCatalog();
    await app.catalog.catalogPage.search(knownProducts.simpleOrderPolicy.keyword);

    await expect(page).toHaveURL(/[?&]search=/);
    const count = await app.catalog.catalogPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    await app.catalog.expectProductVisible(knownProducts.simpleOrderPolicy.name);
  });

  test('@CAT-006 @ui @functional @catalog searching a non-existent term shows no results', async ({ app, page }) => {
    await app.catalog.openCatalog();
    await app.catalog.catalogPage.search('xyzzy_nonexistent_product_99999');

    await expect(page).toHaveURL(/[?&]search=/);
    const count = await app.catalog.catalogPage.getProductCount();
    expect(count).toBe(0);
  });

  test('@CAT-007 @ui @functional @catalog search supports partial and case-insensitive matching', async ({ app }) => {
    await app.catalog.openCatalog();
    await app.catalog.catalogPage.search('desk');

    const count = await app.catalog.catalogPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });
});
