import { OdooModelClient } from '../../../framework/api/OdooModelClient';
import { ProductSchema } from '../schemas/product.schema';
import type { Product } from '../models/Product';

export class ProductService {
  constructor(private readonly client: OdooModelClient) {}

  async findPurchasableProducts(): Promise<Product[]> {
    const records = await this.client.searchRead(
      'product.template',
      [['sale_ok', '=', true], ['active', '=', true]],
      ['id', 'name', 'list_price', 'type', 'invoice_policy'],
    );
    return records.map((r) => {
      const parsed = ProductSchema.parse(r);
      return {
        id: parsed.id,
        name: parsed.name,
        listPrice: parsed.list_price,
        type: parsed.type,
        invoicePolicy: parsed.invoice_policy,
        variantCount: 1,
        isPublished: true,
      };
    });
  }
}
