import type { Page } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

export class CartFlow {
  readonly cartPage: CartPage;

  constructor(private readonly page: Page) {
    this.cartPage = new CartPage(page);
  }

  async openCart(): Promise<void> {
    await this.cartPage.open();
    await this.cartPage.expectCartVisible();
  }

  async removeFirstProduct(): Promise<void> {
    await this.cartPage.removeLine(0);
  }

  async updateFirstProductQuantity(quantity: number): Promise<void> {
    await this.cartPage.updateQuantity(0, quantity);
  }

  async expectCartLineDetails(name: string, quantity: number, price: number, exact = false): Promise<void> {
    await this.cartPage.expectCartLineDetails(name, quantity, price, exact);
  }

  async expectProductInCart(name: string): Promise<void> {
    await this.cartPage.expectProductInCart(name);
  }

  async expectCartEmpty(): Promise<void> {
    await this.cartPage.expectCartEmpty();
  }

  async getCartTotalAmount(): Promise<number> {
    return this.cartPage.getTotalAmount();
  }
}
