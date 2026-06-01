import { type Locator, expect } from '@playwright/test';
import { BaseComponent } from '../../../framework/core/BaseComponent';

export class ProductCard extends BaseComponent {
  constructor(root: Locator) {
    super(root);
  }

  async getName(): Promise<string> {
    return this.root.locator('.o_wsale_product_information a, .product_name').innerText();
  }

  async getPrice(): Promise<string> {
    return this.root.locator('.oe_currency_value').innerText();
  }

  async open(): Promise<void> {
    await this.root.locator('a').first().click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }
}
