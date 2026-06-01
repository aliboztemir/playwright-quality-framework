import { z } from 'zod';

export const InvoiceApiSchema = z.object({
  id:           z.number(),
  name:         z.string(),
  amount_total: z.number(),
  state:        z.enum(['draft', 'posted', 'cancel']),
  partner_id:   z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
});

export type InvoiceApiRecord = z.infer<typeof InvoiceApiSchema>;

import { OdooModelClient } from '../../../framework/api/OdooModelClient';
import type { Invoice } from '../models/Invoice';

export class InvoiceApiService {
  constructor(private readonly client: OdooModelClient) {}

  async findByOrderReference(orderReference: string): Promise<Invoice | null> {
    // First find sale order id
    const orders = await this.client.searchRead(
      'sale.order',
      [['name', '=', orderReference]],
      ['id', 'invoice_ids'],
      1,
    );
    if (orders.length === 0) return null;
    const order = orders[0] as { id: number; invoice_ids: number[] };
    if (!order.invoice_ids || order.invoice_ids.length === 0) return null;

    const invoices = await this.client.searchRead(
      'account.move',
      [['id', 'in', order.invoice_ids], ['move_type', '=', 'out_invoice']],
      ['id', 'name', 'amount_total', 'state', 'partner_id'],
      1,
    );
    if (invoices.length === 0) return null;
    const raw = InvoiceApiSchema.parse(invoices[0]);
    return {
      id:           raw.id,
      name:         raw.name,
      amountTotal:  raw.amount_total,
      state:        raw.state,
      partnerEmail: null, // not returned by default field; use DB for email
    };
  }
}

