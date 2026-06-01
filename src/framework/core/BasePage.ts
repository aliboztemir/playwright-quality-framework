import type { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly path: string;

  /** Exposes the underlying Playwright Page for flows that need direct page access. */
  getPage(): Page {
    return this.page;
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
