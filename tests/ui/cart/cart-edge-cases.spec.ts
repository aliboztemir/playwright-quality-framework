import { test, expect } from '../../../src/fixtures/test';
import { CustomerBuilder } from '../../../src/data/builders/CustomerBuilder';

test.describe('Cart — Edge Cases', () => {
  test('@ui @negative @cart CART-004 empty cart page shows empty state message', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);

    await app.cart.cartPage.open();
    await app.cart.cartPage.expectCartEmpty();
  });

  test('@ui @negative @cart CART-005 checkout button is not shown on empty cart', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);

    await app.cart.cartPage.open();

    await expect(app.cart.cartPage.checkoutButton).not.toBeVisible();
  });

  test('@ui @functional @cart CART-006 removing all items from cart leaves cart empty', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);

    // Add a product
    await app.catalog.openCatalog();
    await app.catalog.openFirstProduct();
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();

    const lineCount = await app.cart.cartPage.getLineCount();
    expect(lineCount).toBeGreaterThan(0);

    // Remove all items one by one
    for (let i = 0; i < lineCount; i++) {
      await app.cart.cartPage.removeLine(0);
    }

    await app.cart.cartPage.expectCartEmpty();
  });

  test('@ui @functional @cart CART-007 updating quantity to zero removes the line', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);

    await app.catalog.openCatalog();
    await app.catalog.openFirstProduct();
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();

    await app.cart.cartPage.updateQuantity(0, 0);

    // After setting qty to 0, line should be removed
    const lineCount = await app.cart.cartPage.getLineCount();
    expect(lineCount).toBe(0);
  });
});
