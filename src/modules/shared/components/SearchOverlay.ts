import { type Locator, type Page } from '@playwright/test';
import { BaseComponent } from '../../../framework/core/BaseComponent';

export class SearchOverlay extends BaseComponent {
  readonly input: Locator;

  constructor(page: Page) {
    super(page.locator('.search-query, .o_search_modal').first());
    this.input = page.getByRole('searchbox');
  }

  async search(keyword: string): Promise<void> {
    await this.input.fill(keyword);
    await this.input.press('Enter');
  }
}
