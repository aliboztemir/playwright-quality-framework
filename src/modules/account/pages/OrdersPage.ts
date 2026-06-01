import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { urls } from '../../../config/urls';

export class OrdersPage extends BasePage {
  readonly path: string;

  readonly orderRows: Locator;

  constructor(page: Page) {
    super(page);
    this.path = urls.orders;
    this.orderRows = page.locator('table tr.o_portal_report_tr, .o_portal_docs tbody tr');
  }

  async expectOrderVisible(reference: string): Promise<void> {
    await expect(this.page.getByText(reference)).toBeVisible();
  }

  async openOrder(reference: string): Promise<void> {
    await this.page.getByText(reference).click();
    await this.waitForReady();
  }
}
