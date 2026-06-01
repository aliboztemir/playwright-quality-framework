import { test } from '@fixtures/test';

test.describe('@catalog Catalog Filters', () => {
  test('@CAT-003 @ui @functional @catalog product search filters catalog to matching results', async ({ app, productData }) => {
    const product = productData.getDefaultProduct();
    await app.catalog.openCatalog();
    await app.catalog.searchAndExpectResults(product.name);
    await app.catalog.expectSearchApplied(product.name);
  });

  test('@CAT-004 @ui @functional @catalog category filter shows products from the selected category', async ({ app, productData }) => {
    await app.catalog.openCatalog();
    const category = await app.catalog.getFirstAvailableCategory();
    await app.catalog.filterByCategory(category);
    await app.catalog.expectOnCategoryPage(category);
    const productsInCategory = productData.getProductsInCategory(category).map(p => p.name);
    await app.catalog.expectAtLeastOneProductVisible(productsInCategory);
  });
});
