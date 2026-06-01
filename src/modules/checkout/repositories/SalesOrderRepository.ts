import { BaseRepository } from '../../../framework/core/BaseRepository';
import type { SalesOrder } from '../models/SalesOrder';
import type { Pool } from 'pg';

export class SalesOrderRepository extends BaseRepository {
  constructor(pool: Pool) {
    super(pool);
  }

  async findByReference(reference: string): Promise<SalesOrder | null> {
    const result = await this.pool.query<{
      id: number;
      name: string;
      state: string;
      invoice_status: string;
      amount_total: number;
      partner_id: number;
      partner_email: string | null;
    }>(
      `SELECT so.id, so.name, so.state, so.invoice_status, so.amount_total,
              so.partner_id, rp.email AS partner_email
       FROM sale_order so
       JOIN res_partner rp ON rp.id = so.partner_id
       WHERE so.name = $1 LIMIT 1`,
      [reference],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0]!;
    return {
      id: row.id,
      name: row.name,
      state: row.state as SalesOrder['state'],
      invoiceStatus: row.invoice_status as SalesOrder['invoiceStatus'],
      amountTotal: row.amount_total,
      partnerId: row.partner_id,
      partnerEmail: row.partner_email,
    };
  }
}
