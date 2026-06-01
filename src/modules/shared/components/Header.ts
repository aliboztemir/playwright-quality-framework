import { type Locator, type Page, expect } from '@playwright/test';
import { BaseComponent } from '../../../framework/core/BaseComponent';

export class Header extends BaseComponent {
  readonly accountMenu: Locator;
  readonly cartIcon: Locator;
  readonly userMenuToggle: Locator;
  readonly myAccountLink: Locator;
  readonly logoutLink: Locator;
  readonly signInLink: Locator;

  constructor(page: Page) {
    super(page.locator('header'));
    this.accountMenu    = page.locator('.o_no_autohide_item.dropdown').first();
    this.cartIcon       = page.locator('#cart_quantity');
    this.userMenuToggle = page.locator('.o_no_autohide_item .dropdown-toggle').first();
    this.myAccountLink  = page.locator('a[href="/my/home"], a[href="/my/account"]').first();
    this.logoutLink     = page.locator('a[href*="/web/session/logout"]').first();
    this.signInLink     = page.locator('a[href*="/web/login"]').first();
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartIcon.innerText();
    return parseInt(text, 10) || 0;
  }

  async expectUserLoggedIn(name: string): Promise<void> {
    await expect(this.userMenuToggle.locator('span')).toHaveText(name);
  }

  async expectMyAccountAccessible(): Promise<void> {
    await this.userMenuToggle.click();
    await expect(this.myAccountLink).toBeVisible();
  }

  async expectUserLoggedOut(): Promise<void> {
    await expect(this.signInLink).toBeVisible();
    await expect(this.logoutLink).not.toBeVisible();
  }
}
