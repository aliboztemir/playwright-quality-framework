import { z } from 'zod';
import { OdooJsonRpcClient } from '../../../framework/api/OdooJsonRpcClient';

export const PaymentProviderSchema = z.object({
  id:    z.number(),
  name:  z.string(),
  state: z.string(),
  code:  z.string(),
});

export type PaymentProvider = z.infer<typeof PaymentProviderSchema>;

export class PaymentProviderService {
  constructor(private readonly client: OdooJsonRpcClient) {}

  async findDemoProvider(): Promise<PaymentProvider | null> {
    const raw = await this.client.searchRead(
      'payment.provider',
      [['code', '=', 'demo'], ['state', '=', 'test']],
      ['id', 'name', 'state', 'code'],
      1,
    );
    return raw.length > 0 ? PaymentProviderSchema.parse(raw[0]) : null;
  }

  async findEnabledProviders(): Promise<PaymentProvider[]> {
    const raw = await this.client.searchRead(
      'payment.provider',
      [['state', 'in', ['test', 'enabled']]],
      ['id', 'name', 'state', 'code'],
      100,
    );
    return raw.map(r => PaymentProviderSchema.parse(r));
  }

  async findAll(): Promise<PaymentProvider[]> {
    const raw = await this.client.searchRead(
      'payment.provider',
      [],
      ['id', 'name', 'state', 'code'],
      100,
    );
    return raw.map(r => PaymentProviderSchema.parse(r));
  }
}
