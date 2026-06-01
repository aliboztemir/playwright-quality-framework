import { z } from 'zod';

export const CustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  login: z.string(),
});

export type CustomerApiRecord = z.infer<typeof CustomerSchema>;
