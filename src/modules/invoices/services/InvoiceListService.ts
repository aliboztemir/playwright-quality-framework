import { z } from 'zod';
import { OdooJsonRpcClient } from '../../../framework/api/OdooJsonRpcClient';

export const CustomerInvoiceSchema = z.object({
  id:           z.number(),
  name:         z.string(),
  state:        z.string(),
  amount_total: z.number(),
  partner_id:   z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  invoice_date: z.union([z.string(), z.literal(false)]),
});

export type CustomerInvoice = z.infer<typeof CustomerInvoiceSchema>;

const VALID_STATES = ['draft', 'posted', 'cancel'] as const;

export class InvoiceListService {
  constructor(private readonly client: OdooJsonRpcClient) {}

  async findCustomerInvoices(limit = 10): Promise<CustomerInvoice[]> {
    const raw = await this.client.searchRead(
      'account.move',
      [['move_type', '=', 'out_invoice']],
      ['id', 'name', 'state', 'amount_total', 'partner_id', 'invoice_date'],
      limit,
    );
    return raw.map(r => CustomerInvoiceSchema.parse(r));
  }

  isValidState(state: string): boolean {
    return (VALID_STATES as readonly string[]).includes(state);
  }
}
