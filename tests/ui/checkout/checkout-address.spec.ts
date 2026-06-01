import { test, expect } from '../../../src/fixtures/test';
import { CustomerBuilder } from '../../../src/data/builders/CustomerBuilder';

test('@ui @functional @checkout delivery address step is visible', async ({ app }) => {
  const customer = CustomerBuilder.random().build();
  await app.auth.registerCustomer(customer);
  await app.catalog.openCatalog();
  await app.catalog.openFirstProduct();
  await app.catalog.productDetailsPage.addToCart();
  await app.cart.openCart();
  await app.cart.cartPage.proceedToCheckout();
  await expect(app.checkout.address.confirmButton).toBeVisible();
});
