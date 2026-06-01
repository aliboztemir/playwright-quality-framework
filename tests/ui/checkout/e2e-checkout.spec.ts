import { test, expect } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';
import { knownProducts } from '@data/testData/products';

test.describe('@checkout Checkout E2E', () => {
  test(
    '@CHK-E2E-001 @ui @e2e @checkout @registered completes registered checkout and verifies order consistency',
    async ({ app, orderVerification, invoiceVerification }) => {
      const customer = CustomerBuilder.random().build();

      await app.auth.registerCustomer(customer);

      await app.catalog.searchAndOpenProduct(knownProducts.simpleOrderPolicy.name);
      await app.catalog.productDetailsPage.addToCart();
      await app.cart.openCart();

      const result = await app.checkout.completeRegisteredCheckout(
        customer.name,
        customer.email,
      );

      expect(result.orderReference).not.toBe('');
      expect(result.products.length).toBeGreaterThan(0);

      await orderVerification.verifyInPortal(result);
      await orderVerification.verifyViaApi(result);
      await orderVerification.verifyInDb(result);

      // Invoice verification (conditional — skips if no invoice generated)
      await invoiceVerification.verifyIfExists(result);
    },
  );

  test(
    '@CHK-E2E-002 @ui @e2e @checkout @guest @conditional completes guest checkout and verifies backend consistency',
    async ({ app, orderVerification, invoiceVerification }) => {
      const guestEmail = `guest-${Date.now()}@example.com`;
      const guestName  = 'E2E Guest User';

      await app.catalog.searchAndOpenProduct(knownProducts.simpleOrderPolicy.name);
      await app.catalog.productDetailsPage.addToCart();
      await app.cart.openCart();

      const result = await app.checkout.completeGuestCheckout({
        name:    guestName,
        email:   guestEmail,
        street:  '123 Test Street',
        city:    'Madrid',
        zip:     '28001',
        country: 'Spain',
      });

      expect(result.orderReference).not.toBe('');
      expect(result.products.length).toBeGreaterThan(0);
      expect(result.customerEmail).toBe(guestEmail);

      // After guest checkout, sign up with same email
      const signupLink = app.checkout.address.getPage().getByRole('link', { name: /sign up|create account/i });
      const hasSignup  = await signupLink.isVisible().catch(() => false);
      if (hasSignup) {
        await signupLink.click();
        await app.auth.registerPage.register(guestName, guestEmail, 'Test1234!');
      } else {
        // Directly register and login with guest email
        await app.auth.registerPage.register(guestName, guestEmail, 'Test1234!').catch(() => {
          // May already exist from guest checkout — try login instead
        });
        await app.auth.login(guestEmail, 'Test1234!');
      }

      // API and DB verification (no portal verification since auth state is uncertain)
      await orderVerification.verifyViaApi(result);
      await orderVerification.verifyInDb(result);
      await invoiceVerification.verifyIfExists(result);
    },
  );

  test(
    '@CHK-E2E-003 @ui @e2e @checkout @registered @multi-product completes multi-product checkout and verifies quantities',
    async ({ app, orderVerification, invoiceVerification }) => {
      const customer = CustomerBuilder.random().build();

      await app.auth.registerCustomer(customer);

      await app.catalog.searchAndOpenProduct(knownProducts.simpleOrderPolicy.name);
      await app.catalog.productDetailsPage.addToCart();

      await app.catalog.searchAndOpenProduct(knownProducts.deliveryPolicy.name);
      await app.catalog.productDetailsPage.addToCart();

      await app.cart.openCart();
      await app.cart.cartPage.updateQuantity(0, 2); // product A → qty 2
      await app.cart.cartPage.updateQuantity(1, 3); // product B → qty 3

      const lineCount = await app.cart.cartPage.getLineCount();
      expect(lineCount).toBe(2);

      const result = await app.checkout.completeRegisteredCheckout(
        customer.name,
        customer.email,
      );

      expect(result.orderReference).not.toBe('');
      expect(result.products.length).toBe(2);

      await orderVerification.verifyInPortal(result);
      await orderVerification.verifyViaApi(result);

      // DB verification — also validates quantities per product
      await orderVerification.verifyInDb(result);

      // Invoice (conditional)
      await invoiceVerification.verifyIfExists(result);
    },
  );
});
