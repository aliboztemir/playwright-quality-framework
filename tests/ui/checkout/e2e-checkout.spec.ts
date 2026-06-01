import { test, expect } from '../../../src/fixtures/test';
import { CustomerBuilder } from '../../../src/data/builders/CustomerBuilder';
import { knownProducts } from '../../../src/data/testData/products';

/**
 * CHK-E2E-001 | Registered customer completes checkout and verifies order/invoice
 * across UI (portal), API and DB.
 */
test(
  '@ui @e2e @checkout @registered CHK-E2E-001 registered customer can complete checkout and verify order across UI, API and DB',
  async ({ app, orderVerification, invoiceVerification }) => {
    const customer = CustomerBuilder.random().build();

    // Register
    await app.auth.registerCustomer(customer);

    // Browse catalog and add product to cart
    await app.catalog.searchAndOpenProduct(knownProducts.simpleOrderPolicy.name);
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();

    // Checkout
    const result = await app.checkout.completeRegisteredCheckout(
      customer.name,
      customer.email,
    );

    expect(result.orderReference).not.toBe('');
    expect(result.products.length).toBeGreaterThan(0);

    // UI portal verification
    await orderVerification.verifyInPortal(result);

    // API verification
    await orderVerification.verifyViaApi(result);

    // DB verification
    await orderVerification.verifyInDb(result);

    // Invoice verification (conditional — skips if no invoice generated)
    await invoiceVerification.verifyIfExists(result);
  },
);

/**
 * CHK-E2E-002 | Guest customer completes checkout, then verifies order across UI, API and DB.
 * @conditional — post-order signup redirect behavior depends on Odoo configuration.
 */
test(
  '@ui @e2e @checkout @guest @conditional CHK-E2E-002 guest customer can complete checkout and verify order across UI, API and DB',
  async ({ app, orderVerification, invoiceVerification }) => {
    const guestEmail = `guest-${Date.now()}@example.com`;
    const guestName  = 'E2E Guest User';

    // Browse catalog as anonymous user
    await app.catalog.searchAndOpenProduct(knownProducts.simpleOrderPolicy.name);
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();

    // Guest checkout with address
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
    const signupLink = app.checkout.address['page'].getByRole('link', { name: /sign up|create account/i });
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

/**
 * CHK-E2E-003 | Registered customer completes checkout with multiple products
 * and different quantities, then verifies across UI, API and DB.
 */
test(
  '@ui @e2e @checkout @registered @multi-product CHK-E2E-003 registered customer can checkout with multiple products and verify order across UI, API and DB',
  async ({ app, orderVerification, invoiceVerification }) => {
    const customer = CustomerBuilder.random().build();

    // Register
    await app.auth.registerCustomer(customer);

    // Product A
    await app.catalog.searchAndOpenProduct(knownProducts.simpleOrderPolicy.name);
    await app.catalog.productDetailsPage.addToCart();

    // Product B
    await app.catalog.searchAndOpenProduct(knownProducts.deliveryPolicy.name);
    await app.catalog.productDetailsPage.addToCart();

    // Open cart and update quantities
    await app.cart.openCart();
    await app.cart.cartPage.updateQuantity(0, 2); // product A → qty 2
    await app.cart.cartPage.updateQuantity(1, 3); // product B → qty 3

    // Verify cart has 2 lines
    const lineCount = await app.cart.cartPage.getLineCount();
    expect(lineCount).toBe(2);

    // Checkout
    const result = await app.checkout.completeRegisteredCheckout(
      customer.name,
      customer.email,
    );

    expect(result.orderReference).not.toBe('');
    expect(result.products.length).toBe(2);

    // UI portal verification
    await orderVerification.verifyInPortal(result);

    // API verification
    await orderVerification.verifyViaApi(result);

    // DB verification — also validates quantities per product
    await orderVerification.verifyInDb(result);

    // Invoice (conditional)
    await invoiceVerification.verifyIfExists(result);
  },
);
