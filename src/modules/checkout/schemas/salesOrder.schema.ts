import { z } from 'zod';

export const SalesOrderSchema = z.object({
  id:             z.number(),
  name:           z.string(),
  state:          z.enum(['draft', 'sale', 'done', 'cancel']),
  invoice_status: z.enum(['no', 'to invoice', 'invoiced', 'upselling']),
  amount_total:   z.number(),
  partner_id:     z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  invoice_ids:    z.array(z.number()).optional().default([]),
});

export type SalesOrderApiRecord = z.infer<typeof SalesOrderSchema>;
