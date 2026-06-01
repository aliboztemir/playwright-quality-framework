import { type ZodSchema, type ZodError } from 'zod';

export function parse<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function safeParse<T>(
  schema: ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: ZodError } {
  return schema.safeParse(data);
}
