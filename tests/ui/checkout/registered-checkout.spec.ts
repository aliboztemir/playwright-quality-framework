import { test, expect } from '../../../src/fixtures/test';
import { CustomerBuilder } from '../../../src/data/builders/CustomerBuilder';
import { knownProducts } from '../../../src/data/testData/products';

test('@ui @e2e @checkout registered customer can complete payment with demo provider', async ({ app }) => {
  const customer = CustomerBuilder.random().build();
  await app.auth.registerCustomer(customer);
  await app.catalog.openCatalog();
  await app.catalog.searchAndExpectResults(knownProducts.simpleOrderPolicy.keyword);
  await app.catalog.openFirstProduct();
  await app.catalog.productDetailsPage.addToCart();
  await app.cart.openCart();
  const result = await app.checkout.completeRegisteredCheckout();
  expect(result.orderReference).not.toBe('');
});
