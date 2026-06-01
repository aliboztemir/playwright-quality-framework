import { OdooModelClient } from '../../../framework/api/OdooModelClient';
import { SalesOrderSchema } from '../schemas/salesOrder.schema';
import type { SalesOrder } from '../models/SalesOrder';

export class SalesOrderService {
  constructor(private readonly client: OdooModelClient) {}

  async findByReference(reference: string): Promise<SalesOrder | null> {
    const records = await this.client.searchRead(
      'sale.order',
      [['name', '=', reference]],
      ['id', 'name', 'state', 'invoice_status', 'amount_total', 'partner_id', 'invoice_ids'],
      1,
    );
    if (records.length === 0) return null;
    const parsed = SalesOrderSchema.parse(records[0]);
    const partnerName = Array.isArray(parsed.partner_id) ? parsed.partner_id[1] : null;
    return {
      id:            parsed.id,
      name:          parsed.name,
      state:         parsed.state,
      invoiceStatus: parsed.invoice_status,
      amountTotal:   parsed.amount_total,
      partnerId:     Array.isArray(parsed.partner_id) ? parsed.partner_id[0] : 0,
      partnerEmail:  partnerName,
    };
  }
}
