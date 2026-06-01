import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { Header } from '../../shared/components/Header';
import { adminCredentials } from '../../../config/credentials';
import { urls } from '../../../config/urls';
import type { Customer } from '../models/Customer';

export class AuthFlow {
  readonly loginPage:    LoginPage;
  readonly registerPage: RegisterPage;
  readonly header:       Header;

  constructor(private readonly page: Page) {
    this.loginPage    = new LoginPage(page);
    this.registerPage = new RegisterPage(page);
    this.header       = new Header(page);
  }

  async registerCustomer(customer: Customer): Promise<void> {
    await this.registerPage.register(customer.name, customer.email, customer.password);
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginPage.login(email, password);
  }

  async loginAsAdmin(): Promise<void> {
    await this.loginPage.login(adminCredentials.email, adminCredentials.password);
  }

  async logout(): Promise<void> {
    await this.page.goto(urls.logout);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectAuthenticatedAs(name: string): Promise<void> {
    await this.header.expectUserLoggedIn(name);
    await this.header.expectMyAccountAccessible();
  }

  async expectAnonymous(): Promise<void> {
    await this.header.expectUserLoggedOut();
  }

  async expectLoginError(): Promise<void> {
    await this.loginPage.expectLoginError();
  }

  /**
   * After a guest checkout, attempts to sign the guest up with the same email.
   * Odoo may show a signup link on the confirmation page; if not, falls back to
   * direct registration. If the account already exists (created implicitly by
   * the checkout), falls back to login instead.
   */
  async signUpAfterGuestCheckout(name: string, email: string, password: string): Promise<void> {
    const signupLink = this.page.getByRole('link', { name: /sign up|create account/i });
    const hasSignup  = await signupLink.isVisible().catch(() => false);
    if (hasSignup) {
      await signupLink.click();
      await this.registerPage.register(name, email, password);
    } else {
      await this.registerPage.register(name, email, password).catch(() => {
        // May already exist from guest checkout — try login instead
      });
      await this.login(email, password);
    }
  }
}
