import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  list_price: z.number(),
  type: z.enum(['consu', 'service', 'combo']),
  invoice_policy: z.enum(['order', 'delivery']),
});

export type ProductApiRecord = z.infer<typeof ProductSchema>;
