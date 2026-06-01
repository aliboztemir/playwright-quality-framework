import { z } from 'zod';
import { OdooJsonRpcClient } from '../../../framework/api/OdooJsonRpcClient';

export const SalesOrderLineSchema = z.object({
  id:                z.number(),
  product_id:        z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  product_uom_qty:   z.number(),
  price_unit:        z.number(),
  price_subtotal:    z.number(),
});

export type SalesOrderLine = z.infer<typeof SalesOrderLineSchema>;

export class SalesOrderLineService {
  constructor(private readonly client: OdooJsonRpcClient) {}

  async findLinesByOrderId(orderId: number): Promise<SalesOrderLine[]> {
    const raw = await this.client.searchRead(
      'sale.order.line',
      [['order_id', '=', orderId]],
      ['id', 'product_id', 'product_uom_qty', 'price_unit', 'price_subtotal'],
      100,
    );
    return raw.map(r => SalesOrderLineSchema.parse(r));
  }
}
