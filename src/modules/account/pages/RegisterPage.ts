import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { urls } from '../../../config/urls';

export class RegisterPage extends BasePage {
  readonly path: string;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.path = `${urls.base}/web/signup`;
    this.nameInput           = page.locator('input[name="name"]');
    this.emailInput          = page.locator('input[name="login"]');
    this.passwordInput       = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirm_password"]');
    this.submitButton        = page.locator('button[type="submit"].btn-primary');
    this.errorMessage        = page.locator('.alert-danger');
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.open();
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
    await this.waitForReady();
  }

  async expectRegistrationError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }
}
