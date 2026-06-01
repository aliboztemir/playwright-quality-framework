import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { urls } from '../../../config/urls';

export class LoginPage extends BasePage {
  readonly path: string;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.path = urls.login;
    this.emailInput    = page.locator('input[name="login"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton  = page.locator('button[type="submit"].btn-primary');
    this.errorMessage  = page.locator('.alert-danger');
  }

  async login(email: string, password: string): Promise<void> {
    await this.open();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.waitForReady();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.page).toHaveURL(/web\/login/);
  }
}
