import { test, expect } from '../../../src/fixtures/test';

test('@ui @functional @checkout delivery address step is visible', async ({ app }) => {
  await app.auth.loginPage.login('', ''); // TODO: use registered test user
  await app.catalog.openCatalog();
  await app.catalog.openFirstProduct();
  await app.catalog.productDetailsPage.addToCart();
  await app.cart.openCart();
  await app.cart.cartPage.proceedToCheckout();
  await expect(app.checkout.address.confirmButton).toBeVisible();
});
