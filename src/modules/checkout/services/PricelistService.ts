import { z } from 'zod';
import { OdooJsonRpcClient } from '../../../framework/api/OdooJsonRpcClient';

export const PricelistSchema = z.object({
  id:          z.number(),
  name:        z.string(),
  currency_id: z.tuple([z.number(), z.string()]),
  sequence:    z.number(),
});

export type Pricelist = z.infer<typeof PricelistSchema>;

export class PricelistService {
  constructor(private readonly client: OdooJsonRpcClient) {}

  async findAll(): Promise<Pricelist[]> {
    const raw = await this.client.searchRead(
      'product.pricelist',
      [],
      ['id', 'name', 'currency_id', 'sequence'],
      100,
    );
    return raw.map(r => PricelistSchema.parse(r));
  }

  async findByName(name: string): Promise<Pricelist | null> {
    const raw = await this.client.searchRead(
      'product.pricelist',
      [['name', '=', name]],
      ['id', 'name', 'currency_id', 'sequence'],
      1,
    );
    return raw.length > 0 ? PricelistSchema.parse(raw[0]) : null;
  }
}
