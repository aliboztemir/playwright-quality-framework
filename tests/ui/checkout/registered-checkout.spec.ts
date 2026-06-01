import { test, expect } from '../../../src/fixtures/test';
import { knownProducts } from '../../../src/data/testData/products';

test('@ui @e2e @checkout registered customer can complete payment with demo provider', async ({ app }) => {
  await app.auth.loginPage.login('', ''); // TODO: use registered test user
  await app.catalog.openCatalog();
  await app.catalog.searchAndExpectResults(knownProducts.simpleOrderPolicy.keyword);
  await app.catalog.openFirstProduct();
  await app.catalog.productDetailsPage.addToCart();
  await app.cart.openCart();
  const result = await app.checkout.completeRegisteredCheckout();
  expect(result.orderReference).not.toBe('');
});
