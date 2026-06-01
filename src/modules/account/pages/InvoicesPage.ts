import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { urls } from '../../../config/urls';

export class InvoicesPage extends BasePage {
  readonly path: string;

  readonly invoiceRows: Locator;

  constructor(page: Page) {
    super(page);
    this.path        = urls.invoices;
    this.invoiceRows = page.locator('.o_portal_docs tbody tr, table tr.o_portal_report_tr');
  }

  async expectInvoiceVisible(reference: string): Promise<void> {
    await expect(this.page.getByText(reference)).toBeVisible();
  }

  async openInvoice(reference: string): Promise<void> {
    await this.page.getByText(reference).click();
    await this.waitForReady();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/my\/invoices/);
  }
}
