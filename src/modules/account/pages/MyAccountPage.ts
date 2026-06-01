import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { urls } from '../../../config/urls';

export class MyAccountPage extends BasePage {
  readonly path: string;

  readonly ordersLink:         Locator;
  readonly ordersCard:         Locator;
  readonly invoicesCard:       Locator;
  readonly paymentMethodsCard: Locator;
  readonly addressesCard:      Locator;
  readonly securityCard:       Locator;
  readonly customerName:       Locator;

  constructor(page: Page) {
    super(page);
    this.path               = urls.home;
    this.ordersLink         = page.getByRole('link', { name: /orders|your orders/i });
    this.ordersCard         = page.locator('a[title="Your Orders"]');
    this.invoicesCard       = page.locator('a[title="Your Invoices"]');
    this.paymentMethodsCard = page.locator('a[title="Payment methods"]');
    this.addressesCard      = page.locator('a[title="Addresses"]');
    this.securityCard       = page.locator('a[title="Connection & Security"]');
    this.customerName       = page.locator('.d-none.d-lg-flex h5.mb-0').first();
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToOrders(): Promise<void> {
    await this.ordersLink.click();
    await this.waitForReady();
  }

  async expectLoaded(customerName: string): Promise<void> {
    await expect(this.page).toHaveURL(/my\/home/);
    await expect(this.ordersCard).toBeVisible();
    await expect(this.invoicesCard).toBeVisible();
    await expect(this.paymentMethodsCard).toBeVisible();
    await expect(this.addressesCard).toBeVisible();
    await expect(this.securityCard).toBeVisible();
    await expect(this.customerName).toContainText(customerName);
  }

  async expectAccountVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/my\/account|my\/home/);
  }
}
