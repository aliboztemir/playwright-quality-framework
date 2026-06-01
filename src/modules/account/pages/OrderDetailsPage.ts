import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';

export class OrderDetailsPage extends BasePage {
  readonly path = '/my/orders';

  readonly invoiceSection: Locator;
  readonly downloadInvoiceLink: Locator;

  constructor(page: Page) {
    super(page);
    this.invoiceSection = page.locator('.o_portal_invoice_list, #portal-invoice-list');
    this.downloadInvoiceLink = page.getByRole('link', { name: /download|view invoice/i });
  }

  async expectInvoiceVisible(): Promise<void> {
    await expect(this.invoiceSection).toBeVisible();
  }
}
