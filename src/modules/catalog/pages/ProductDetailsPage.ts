import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';

export class ProductDetailsPage extends BasePage {
  readonly path = '/shop';

  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.getByRole('heading', { level: 1 });
    this.productPrice = page.locator('.oe_price .oe_currency_value').first();
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getProductPrice(): Promise<number> {
    const raw = await this.productPrice.innerText();
    return parseFloat(raw.replace(/[^\d.]/g, ''));
  }

  async getProductName(): Promise<string> {
    return this.productName.innerText();
  }

  async expectProductLoaded(): Promise<void> {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
  }
}
