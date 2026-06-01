import { BaseRepository } from '../../../framework/core/BaseRepository';
import type { Invoice } from '../models/Invoice';
import type { Pool } from 'pg';

export class InvoiceRepository extends BaseRepository {
  constructor(pool: Pool) {
    super(pool);
  }

  async findByOrderReference(orderReference: string): Promise<Invoice | null> {
    const result = await this.pool.query<{
      id:           number;
      name:         string;
      amount_total: number;
      state:        string;
      partner_email: string | null;
    }>(
      `SELECT am.id, am.name, am.amount_total, am.state, rp.email AS partner_email
       FROM account_move am
       JOIN res_partner rp ON rp.id = am.partner_id
       WHERE am.move_type = 'out_invoice'
         AND am.id IN (
           SELECT account_move_id FROM sale_order_invoice_rel sir
           JOIN sale_order so ON so.id = sir.sale_order_id
           WHERE so.name = $1
         )
       LIMIT 1`,
      [orderReference],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0]!;
    return {
      id:           row.id,
      name:         row.name,
      amountTotal:  row.amount_total,
      state:        row.state as Invoice['state'],
      partnerEmail: row.partner_email,
    };
  }
}
