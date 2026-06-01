import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { Header } from '../../shared/components/Header';
import { adminCredentials } from '../../../config/credentials';
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
    await this.page.goto('/web/session/logout');
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
}
