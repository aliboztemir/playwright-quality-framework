import { type Locator, expect } from '@playwright/test';
import { BaseComponent } from '../../../framework/core/BaseComponent';

export class AddressCard extends BaseComponent {
  constructor(root: Locator) {
    super(root);
  }

  async select(): Promise<void> {
    await this.root.click();
  }

  async expectSelected(): Promise<void> {
    await expect(this.root).toHaveClass(/selected|active/);
  }
}
