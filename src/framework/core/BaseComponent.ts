import type { Locator } from '@playwright/test';

export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async waitForVisible(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }
}
