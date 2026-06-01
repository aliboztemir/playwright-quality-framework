import type { Page } from '@playwright/test';
import { urls } from '../../../config/urls';

export class NavigationFlow {
  constructor(private readonly page: Page) {}

  async goToShop(): Promise<void> {
    await this.page.goto(urls.shop);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToAccount(): Promise<void> {
    await this.page.goto(urls.account);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToOrders(): Promise<void> {
    await this.page.goto(urls.orders);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
