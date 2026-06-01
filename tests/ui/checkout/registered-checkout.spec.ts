import { test, expect } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';
import { knownProducts } from '@data/testData/products';

test.describe('@checkout Registered Checkout', () => {
  test('@CHK-REG-001 @ui @e2e @checkout completes payment with demo provider', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);
    await app.catalog.openCatalog();
    await app.catalog.searchAndExpectResults(knownProducts.simpleOrderPolicy.keyword);
    await app.catalog.openFirstProduct();
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    const result = await app.checkout.completeRegisteredCheckout();
    expect(result.orderReference).not.toBe('');
  });
});

