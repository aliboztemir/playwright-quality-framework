import { expect, type Page } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

export class CatalogFlow {
  readonly catalogPage: CatalogPage;
  readonly productDetailsPage: ProductDetailsPage;

  constructor(private readonly page: Page) {
    this.catalogPage = new CatalogPage(page);
    this.productDetailsPage = new ProductDetailsPage(page);
  }

  async searchAndOpenProduct(name: string): Promise<void> {
    await this.catalogPage.open();
    await this.catalogPage.search(name);
    await this.catalogPage.openProductNamed(name);
    await this.productDetailsPage.expectProductLoaded();
  }

  async openCatalog(): Promise<void> {
    await this.catalogPage.open();
    await this.catalogPage.expectCatalogReady();
  }

  async searchAndExpectResults(keyword: string): Promise<void> {
    await this.catalogPage.open();
    await this.catalogPage.search(keyword);
  }

  async getFirstAvailableCategory(): Promise<string> {
    return this.catalogPage.getFirstFilmstripCategoryName();
  }

  async expectSearchApplied(keyword: string): Promise<void> {
    await expect(this.page).toHaveURL(/[?&]search=/);
    await this.catalogPage.expectProductVisible(keyword);
  }

  async filterByCategory(name: string): Promise<void> {
    await this.catalogPage.filterByCategory(name);
  }

  async expectAtLeastOneProductVisible(names: string[]): Promise<void> {
    await this.catalogPage.expectAtLeastOneProductVisible(names);
  }

  async expectProductVisible(name: string): Promise<void> {
    await this.catalogPage.expectProductVisible(name);
  }

  async expectOnCategoryPage(categoryName?: string): Promise<void> {
    await this.catalogPage.expectCategoryPageLoaded(categoryName);
  }

  async getFirstProductName(): Promise<string> {
    return this.catalogPage.getFirstProductName();
  }

  async openFirstProduct(): Promise<void> {
    await this.catalogPage.openFirstProduct();
    await this.productDetailsPage.expectProductLoaded();
  }
}
