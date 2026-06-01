import { type Locator, expect } from '@playwright/test';
import { BaseComponent } from '../../../framework/core/BaseComponent';

export class CheckoutSummary extends BaseComponent {
  constructor(root: Locator) {
    super(root);
  }

  async getTotal(): Promise<string> {
    return this.root.locator('.oe_currency_value').last().innerText();
  }

  async expectTotalVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }
}
