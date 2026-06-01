import { test, expect } from '../../../src/fixtures/test';

test('@ui @e2e @account completed order appears in your orders', async ({ app }) => {
  await app.auth.loginPage.login('', ''); // TODO: use registered test user
  await app.catalog.openCatalog();
  await app.catalog.openFirstProduct();
  await app.catalog.productDetailsPage.addToCart();
  await app.cart.openCart();
  const result = await app.checkout.completeRegisteredCheckout();

  await app.nav.goToOrders();
  await app.account.orders.expectOrderVisible(result.orderReference);
});
