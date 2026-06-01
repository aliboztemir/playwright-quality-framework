import { test } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';

test.describe('@account Orders Portal', () => {
  test('@ORD-001 @ui @e2e @account completed order is visible in the orders portal', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);
    await app.catalog.openCatalog();
    await app.catalog.openFirstProduct();
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    const result = await app.checkout.completeRegisteredCheckout();

    await app.nav.goToOrders();
    await app.account.orders.expectOrderVisible(result.orderReference);
  });
});
