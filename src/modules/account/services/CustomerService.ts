import { OdooModelClient } from '../../../framework/api/OdooModelClient';
import { CustomerSchema } from '../schemas/customer.schema';

export class CustomerService {
  constructor(private readonly client: OdooModelClient) {}

  async findByEmail(email: string): Promise<{ id: number; name: string; email: string } | null> {
    const records = await this.client.searchRead(
      'res.users',
      [['login', '=', email]],
      ['id', 'name', 'login'],
      1,
    );
    if (records.length === 0) return null;
    const parsed = CustomerSchema.parse(records[0]);
    return { id: parsed.id, name: parsed.name, email: parsed.login };
  }
}
