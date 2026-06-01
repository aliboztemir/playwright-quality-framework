import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { extractReference } from '../../../framework/utils/strings';

export class PaymentStatusPage extends BasePage {
  readonly path = '/payment/status';

  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.successMessage = page.getByText(/your payment has been processed/i);
  }

  async extractOrderReference(): Promise<string | null> {
    const pageText = await this.page.locator('body').innerText();
    return extractReference(pageText);
  }

  async expectPaymentSuccess(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 15000 });
  }
}
