import { test, expect } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';

test.describe('@checkout Checkout Address', () => {
  test('@CHK-ADDR-001 @ui @functional @checkout address confirmation step is visible', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);
    await app.catalog.openCatalog();
    await app.catalog.openFirstProduct();
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    await app.cart.cartPage.proceedToCheckout();
    await expect(app.checkout.address.confirmButton).toBeVisible();
  });
});
