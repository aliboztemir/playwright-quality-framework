import { test, expect } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';

test.describe('@cart Cart Edge Cases', () => {
  test.describe('Empty Cart', () => {
    test.beforeEach(async ({ app }) => {
      const customer = CustomerBuilder.random().build();
      await app.auth.registerCustomer(customer);
      await app.cart.cartPage.open();
    });

    test('@CART-004 @ui @negative @cart empty cart displays empty state message', async ({ app }) => {
      await app.cart.cartPage.expectCartEmpty();
    });

    test('@CART-005 @ui @negative @cart checkout button is hidden on empty cart', async ({ app }) => {
      await expect(app.cart.cartPage.checkoutButton).not.toBeVisible();
    });
  });

  test.describe('With Items', () => {
    test.beforeEach(async ({ app }) => {
      const customer = CustomerBuilder.random().build();
      await app.auth.registerCustomer(customer);
      await app.catalog.openCatalog();
      await app.catalog.openFirstProduct();
      await app.catalog.productDetailsPage.addToCart();
      await app.cart.openCart();
    });

    test('@CART-006 @ui @functional @cart removing all items leaves cart empty', async ({ app }) => {
      const lineCount = await app.cart.cartPage.getLineCount();
      expect(lineCount).toBeGreaterThan(0);

      await app.cart.cartPage.removeAllItems();

      await app.cart.cartPage.expectCartEmpty();
    });

    test('@CART-007 @ui @functional @cart setting quantity to zero removes the line', async ({ app }) => {
      await app.cart.cartPage.updateQuantity(0, 0);

      const lineCount = await app.cart.cartPage.getLineCount();
      expect(lineCount).toBe(0);
    });
  });
});
