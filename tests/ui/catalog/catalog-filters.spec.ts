import { test, expect } from '@fixtures/test';

test.describe('Catalog Filters', () => {
  test('@ui @functional @catalog CAT-003 product search filters catalog results', async ({ app, productData }) => {
    const product = productData.getDefaultProduct();
    await app.catalog.openCatalog();
    await app.catalog.searchAndExpectResults(product.name);
    await app.catalog.expectSearchApplied(product.name);
  });

  test('@ui @functional @catalog CAT-004 category filter displays products from selected category', async ({ app, productData }) => {
    await app.catalog.openCatalog();
    const category = await app.catalog.getFirstAvailableCategory();
    await app.catalog.filterByCategory(category);
    await app.catalog.expectOnCategoryPage(category);
    const productsInCategory = productData.getProductsInCategory(category).map(p => p.name);
    await app.catalog.expectAtLeastOneProductVisible(productsInCategory);
  });
});
