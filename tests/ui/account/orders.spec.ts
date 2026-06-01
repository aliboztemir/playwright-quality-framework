import { test, expect } from '../../../src/fixtures/test';
import { CustomerBuilder } from '../../../src/data/builders/CustomerBuilder';

test('@ui @e2e @account completed order appears in your orders', async ({ app }) => {
  const customer = CustomerBuilder.random().build();
  await app.auth.registerCustomer(customer);
  await app.catalog.openCatalog();
  await app.catalog.openFirstProduct();
  await app.catalog.productDetailsPage.addToCart();
  await app.cart.openCart();
  const result = await app.checkout.completeRegisteredCheckout();

  await app.nav.goToOrders();
  await app.account.orders.expectOrderVisible(result.orderReference);
});
