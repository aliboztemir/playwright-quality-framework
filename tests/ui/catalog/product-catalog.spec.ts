import { test, expect } from '@fixtures/test';
import { knownProducts } from '@data/testData/products';

test.describe('@catalog Product Catalog', () => {
  test('@CAT-001 @ui @smoke @catalog product catalog loads with search and category filters', async ({ app }) => {
    await app.catalog.openCatalog();
    await expect(app.catalog.catalogPage.heading).toBeVisible();
    await expect(app.catalog.catalogPage.searchInput).toBeVisible();
    await expect(app.catalog.catalogPage.categoryFilmstrip).toBeVisible();
  });

  test('@CAT-002 @ui @smoke @catalog product detail page shows name, price and add-to-cart', async ({ app }) => {
    await app.catalog.openCatalog();
    await app.catalog.openFirstProduct();
    await expect(app.catalog.productDetailsPage.productName).toBeVisible();
    await expect(app.catalog.productDetailsPage.productPrice).toBeVisible();
    await expect(app.catalog.productDetailsPage.addToCartButton).toBeVisible();
  });

  test('@CAT-008 @ui @functional @catalog known product shows correct name, price and URL', async ({ app, page }) => {
    await app.catalog.openCatalog();
    await app.catalog.searchAndExpectResults(knownProducts.simpleOrderPolicy.keyword);
    await app.catalog.openFirstProduct();
    await expect(app.catalog.productDetailsPage.productName).toContainText(knownProducts.simpleOrderPolicy.name);
    await expect(app.catalog.productDetailsPage.productPrice).toBeVisible();
    await expect(app.catalog.productDetailsPage.addToCartButton).toBeEnabled();
    await expect(page).toHaveURL(/\/shop\//);
  });
});
