import type { Page } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';

export class CheckoutPage extends BasePage {
  readonly path = '/shop/checkout';

  constructor(page: Page) {
    super(page);
  }
}
