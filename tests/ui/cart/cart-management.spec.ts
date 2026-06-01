import { test, expect } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';

test.describe('Cart Management', () => {
  let registeredEmail = '';
  let registeredPassword = '';

  test.beforeEach(async ({ app }) => {
    if (!registeredEmail) {
      const customer = CustomerBuilder.random().build();
      registeredEmail = customer.email;
      registeredPassword = customer.password;
      await app.auth.registerCustomer(customer);
    } else {
      await app.auth.login(registeredEmail, registeredPassword);
    }
  });

  test('@ui @functional @cart CART-001 Added product is displayed in cart', async ({ app, productData }) => {
    const product = productData.getProductInCategory('Boxes');
    await app.catalog.searchAndOpenProduct(product.name);
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    await app.cart.expectCartLineDetails(product.name, 1, product.price, true);
  });

  test('@ui @functional @cart CART-002 Product quantity update recalculates cart total', async ({ app, productData }) => {
    const product = productData.getProductInCategory('Boxes');
    await app.catalog.searchAndOpenProduct(product.name);
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    await app.cart.expectCartLineDetails(product.name, 1, product.price, true);
    await app.cart.updateFirstProductQuantity(2);
    await app.cart.expectCartLineDetails(product.name, 2, product.price*2, true);
  });

  test('@ui @functional @cart CART-003 Product can be removed from cart', async ({ app, productData }) => {
    const product = productData.getProductInCategory('Boxes');
    await app.catalog.searchAndOpenProduct(product.name);
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    await app.cart.removeFirstProduct();
    await app.cart.expectCartEmpty();
  });
});
