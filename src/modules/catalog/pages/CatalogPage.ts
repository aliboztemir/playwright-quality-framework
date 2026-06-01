import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { urls } from '../../../config/urls';

export class CatalogPage extends BasePage {
  readonly path: string;

  readonly heading:     Locator;
  readonly productGrid: Locator;
  readonly searchInput: Locator;
  readonly filterArea:  Locator;
  readonly categoryFilmstrip: Locator;

  constructor(page: Page) {
    super(page);
    this.path             = urls.shop;
    this.heading          = page.getByRole('heading', { name: /products/i });
    this.productGrid      = page.locator('.o_wsale_products_grid_table, .row.o_wsale_products');
    this.searchInput      = page.getByRole('searchbox');
    this.filterArea       = page.locator('#products_grid_before');
    this.categoryFilmstrip = page.locator('#o_wsale_categories_filmstrip');
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.waitForReady();
  }

  async openProductNamed(name: string): Promise<void> {
    await this.page
      .locator('.o_wsale_product_grid_wrapper', { hasText: name })
      .locator('a')
      .first()
      .click();
    await this.page.waitForURL(/\/shop\/.+/);
    await this.waitForReady();
  }

  async openFirstProduct(): Promise<void> {
    await this.page.locator('.o_wsale_product_grid_wrapper a').first().click();
    await this.page.waitForURL(/\/shop\/.+/);
    await this.waitForReady();
  }

  async sortBy(order: string): Promise<void> {
    await this.page.goto(`${this.path}?order=${encodeURIComponent(order)}`);
    await this.waitForReady();
  }

  async filterByCategory(name: string): Promise<void> {
    await this.categoryFilmstrip.locator(`a[aria-label="${name}"]`).click();
    await this.waitForReady();
  }

  async selectFirstAttributeFilter(): Promise<void> {
    const accordionBtn = this.filterArea.locator('.accordion-button').first();
    const isCollapsed = await accordionBtn.evaluate(el => el.classList.contains('collapsed'));
    if (isCollapsed) {
      await accordionBtn.click();
      await this.page.waitForTimeout(300);
    }
    await this.filterArea
      .locator('.products_attributes_filters input[type="checkbox"]').first()
      .check({ force: true });
    await this.waitForReady();
  }

  async getFirstProductName(): Promise<string> {
    return this.page.locator('h2.o_wsale_products_item_title').first().innerText();
  }

  async getProductCount(): Promise<number> {
    return this.page.locator('.o_wsale_product_grid_wrapper').count();
  }

  async getFirstFilmstripCategoryName(): Promise<string> {
    // XPath: #o_wsale_categories_filmstrip > div > ul > li > a (first visible category link)
    const link = this.page.locator('#o_wsale_categories_filmstrip div ul li a[aria-label]').first();
    await expect(link).toBeAttached();
    const name = await link.getAttribute('aria-label');
    if (!name) throw new Error('CatalogPage: no category link found in filmstrip');
    return name;
  }

  async expectAtLeastOneProductVisible(names: string[]): Promise<void> {
    const visibleNames: string[] = [];
    for (const name of names) {
      const count = await this.page
        .getByRole('heading', { name, exact: true })
        .and(this.page.locator('h2.o_wsale_products_item_title'))
        .count();
      if (count > 0) visibleNames.push(name);
    }
    if (visibleNames.length === 0) {
      throw new Error(
        `Expected at least one of these products to be visible in the grid: ${names.join(', ')}`,
      );
    }
  }

  async expectProductVisible(name: string): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name, exact: true }).and(
        this.page.locator('h2.o_wsale_products_item_title')
      )
    ).toBeVisible();
  }

  async expectCategoryPageLoaded(_categoryName?: string): Promise<void> {
    // URL is the stable proof that category filter was applied.
    // Product visibility (expectAtLeastOneProductVisible) is the content proof.
    await expect(this.page).toHaveURL(/\/shop\/category\//);
    await this.expectCatalogReady();
  }

  async expectCatalogReady(): Promise<void> {
    await expect(this.productGrid).toBeVisible();
    await expect(this.page.locator('.o_wsale_product_grid_wrapper').first()).toBeVisible();
  }
}
