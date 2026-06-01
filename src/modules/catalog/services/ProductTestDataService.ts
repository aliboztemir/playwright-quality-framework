import type { ProductRepository } from '../repositories/ProductRepository';
import type { ProductTestData } from '../models/ProductTestData';

export class ProductTestDataService {
  private products: ProductTestData[] = [];

  constructor(private readonly repository: ProductRepository) {}

  async load(): Promise<void> {
    this.products = await this.repository.findPublishedForUiTesting();
    if (this.products.length === 0) {
      throw new Error('ProductTestDataService: no published products found in DB');
    }
  }

  getAll(): ReadonlyArray<ProductTestData> {
    return this.products;
  }

  /** Simple single-variant product — suitable for basic search/add-to-cart tests. */
  getDefaultProduct(): ProductTestData {
    const found = this.products.find(
      p => p.variantCount === 1 && p.type === 'consu' && p.categoryName !== null,
    );
    return found ?? this.products[0]!;
  }

  /** Product with multiple variants — suitable for variant selection tests. */
  getProductWithVariants(): ProductTestData {
    const found = this.products.find(p => p.variantCount > 1);
    if (!found) throw new Error('ProductTestDataService: no product with variants found');
    return found;
  }

  /** Product with order invoice policy — invoice generated on order confirmation. */
  getProductWithOrderPolicy(): ProductTestData {
    const found = this.products.find(
      p => p.invoicePolicy === 'order' && p.variantCount === 1,
    );
    if (!found) throw new Error('ProductTestDataService: no order-policy product found');
    return found;
  }

  /** First public category name available in the product set. */
  getFirstAvailableCategory(): string {
    const found = this.products.find(p => p.categoryName !== null);
    if (!found?.categoryName) {
      throw new Error('ProductTestDataService: no product with a public category found');
    }
    return found.categoryName;
  }

  /** All published products belonging to a specific public category. */
  getProductsInCategory(categoryName: string): ProductTestData[] {
    return this.products.filter(
      p => p.categoryName?.toLowerCase() === categoryName.toLowerCase(),
    );
  }

  /** Product belonging to a specific public category. */
  getProductInCategory(categoryName: string): ProductTestData {
    const found = this.products.find(
      p => p.categoryName?.toLowerCase() === categoryName.toLowerCase(),
    );
    if (!found) {
      throw new Error(`ProductTestDataService: no product found in category "${categoryName}"`);
    }
    return found;
  }
}
