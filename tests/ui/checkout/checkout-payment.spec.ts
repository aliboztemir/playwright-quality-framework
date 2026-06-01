import { test, expect } from '../../../src/fixtures/test';

test('@ui @smoke @checkout demo payment method is visible on payment step', async ({ app }) => {
  await app.auth.loginPage.login('', ''); // TODO: use registered test user
  await app.catalog.openCatalog();
  await app.catalog.openFirstProduct();
  await app.catalog.productDetailsPage.addToCart();
  await app.cart.openCart();
  await app.cart.cartPage.proceedToCheckout();
  await app.checkout.address.confirmAddress();
  await expect(app.checkout.payment.payNowButton).toBeVisible();
  await expect(app.checkout.payment.demoPaymentOption).toBeVisible();
});
