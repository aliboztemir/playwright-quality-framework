import { test, expect } from '@fixtures/test';
import { knownProducts } from '@data/testData/products';

test.describe('Catalog', () => {
  test('@ui @smoke @catalog CAT-001 product catalog displays available products', async ({ app }) => {
    await app.catalog.openCatalog();
    await expect(app.catalog.catalogPage.heading).toBeVisible();
    await expect(app.catalog.catalogPage.searchInput).toBeVisible();
    await expect(app.catalog.catalogPage.categoryFilmstrip).toBeVisible();
  });

  test('@ui @smoke @catalog CAT-002 product details can be opened', async ({ app }) => {
    await app.catalog.openCatalog();
    await app.catalog.openFirstProduct();
    await expect(app.catalog.productDetailsPage.productName).toBeVisible();
    await expect(app.catalog.productDetailsPage.productPrice).toBeVisible();
    await expect(app.catalog.productDetailsPage.addToCartButton).toBeVisible();
  });

  test('@ui @functional @catalog CAT-008 product information is displayed correctly', async ({ app, page }) => {
    await app.catalog.openCatalog();
    await app.catalog.searchAndExpectResults(knownProducts.simpleOrderPolicy.keyword);
    await app.catalog.openFirstProduct();
    await expect(app.catalog.productDetailsPage.productName).toContainText(knownProducts.simpleOrderPolicy.name);
    await expect(app.catalog.productDetailsPage.productPrice).toBeVisible();
    await expect(app.catalog.productDetailsPage.addToCartButton).toBeEnabled();
    await expect(page).toHaveURL(/\/shop\//);
  });
});
