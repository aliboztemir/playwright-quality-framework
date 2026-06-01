import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';

export class PaymentStepPage extends BasePage {
  readonly path = '/shop/checkout';

  readonly payNowButton: Locator;
  readonly demoPaymentOption: Locator;

  constructor(page: Page) {
    super(page);
    this.payNowButton = page.getByRole('button', { name: /pay now/i });
    this.demoPaymentOption = page.getByText(/demo/i).first();
  }

  async payWithDemo(): Promise<void> {
    await this.demoPaymentOption.click();
    await this.payNowButton.click();
    await this.waitForReady();
  }

  async expectPaymentStepVisible(): Promise<void> {
    await expect(this.payNowButton).toBeVisible();
  }
}
