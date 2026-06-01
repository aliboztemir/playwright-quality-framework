import { BaseRepository } from '../../../framework/core/BaseRepository';
import type { OrderLine } from '../models/OrderLine';
import type { Pool } from 'pg';

export class OrderLineRepository extends BaseRepository {
  constructor(pool: Pool) {
    super(pool);
  }

  async findByOrderReference(reference: string): Promise<OrderLine[]> {
    const result = await this.pool.query<{
      product_name: string;
      product_qty:  number;
      price_unit:   number;
      price_subtotal: number;
    }>(
      `SELECT sol.name AS product_name, sol.product_qty, sol.price_unit, sol.price_subtotal
       FROM sale_order_line sol
       JOIN sale_order so ON so.id = sol.order_id
       WHERE so.name = $1
       ORDER BY sol.id`,
      [reference],
    );
    return result.rows.map(row => ({
      productName: row.product_name,
      quantity:    row.product_qty,
      priceUnit:   row.price_unit,
      subtotal:    row.price_subtotal,
    }));
  }
}
