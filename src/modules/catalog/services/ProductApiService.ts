import { z } from 'zod';
import { OdooJsonRpcClient } from '../../../framework/api/OdooJsonRpcClient';

export const ProductApiSchema = z.object({
  id:                z.number(),
  name:              z.string(),
  list_price:        z.number(),
  sale_ok:           z.boolean(),
  website_published: z.boolean().optional(),
});

export type ProductApiRecord = z.infer<typeof ProductApiSchema>;

export class ProductApiService {
  constructor(private readonly client: OdooJsonRpcClient) {}

  async findPurchasableProducts(): Promise<ProductApiRecord[]> {
    const raw = await this.client.searchRead(
      'product.template',
      [['sale_ok', '=', true], ['active', '=', true]],
      ['id', 'name', 'list_price', 'sale_ok', 'website_published'],
      100,
    );
    return raw.map(r => ProductApiSchema.parse(r));
  }

  async findPublishedProducts(): Promise<ProductApiRecord[]> {
    const raw = await this.client.searchRead(
      'product.template',
      [['website_published', '=', true], ['sale_ok', '=', true]],
      ['id', 'name', 'list_price', 'sale_ok', 'website_published'],
      100,
    );
    return raw.map(r => ProductApiSchema.parse(r));
  }

  async findByName(name: string): Promise<ProductApiRecord | null> {
    const raw = await this.client.searchRead(
      'product.template',
      [['name', '=', name]],
      ['id', 'name', 'list_price', 'sale_ok', 'website_published'],
      1,
    );
    return raw.length > 0 ? ProductApiSchema.parse(raw[0]) : null;
  }
}
