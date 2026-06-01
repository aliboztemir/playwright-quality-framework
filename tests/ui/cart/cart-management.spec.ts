import { test, expect } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';

test.describe('@cart Cart Management', () => {
  test.beforeEach(async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);
  });

  test('@CART-001 @ui @functional @cart added product appears in cart with correct details', async ({ app, productData }) => {
    const product = productData.getProductInCategory('Boxes');
    await app.catalog.searchAndOpenProduct(product.name);
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    await app.cart.expectCartLineDetails(product.name, 1, product.price, true);
  });

  test('@CART-002 @ui @functional @cart quantity update recalculates cart total', async ({ app, productData }) => {
    const product = productData.getProductInCategory('Boxes');
    await app.catalog.searchAndOpenProduct(product.name);
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    await app.cart.expectCartLineDetails(product.name, 1, product.price, true);
    await app.cart.updateFirstProductQuantity(2);
    await app.cart.expectCartLineDetails(product.name, 2, product.price*2, true);
  });

  test('@CART-003 @ui @functional @cart product removal empties the cart', async ({ app, productData }) => {
    const product = productData.getProductInCategory('Boxes');
    await app.catalog.searchAndOpenProduct(product.name);
    await app.catalog.productDetailsPage.addToCart();
    await app.cart.openCart();
    await app.cart.removeFirstProduct();
    await app.cart.expectCartEmpty();
  });
});
