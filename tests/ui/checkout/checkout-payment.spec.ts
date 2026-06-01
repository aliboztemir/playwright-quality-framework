import { test, expect } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';

test.describe('Checkout Payment', () => {
  test('@ui @smoke @checkout demo payment method is visible on payment step', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);
    await app.catalog.openCatalog();
    await app.catalog.openFirstProduct();
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    await app.cart.cartPage.proceedToCheckout();
    await app.checkout.address.confirmAddress();
    await expect(app.checkout.payment.payNowButton).toBeVisible();
    await expect(app.checkout.payment.demoPaymentOption).toBeVisible();
  });
});
