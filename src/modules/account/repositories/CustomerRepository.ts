import { BaseRepository } from '../../../framework/core/BaseRepository';
import type { Pool } from 'pg';

export class CustomerRepository extends BaseRepository {
  constructor(pool: Pool) {
    super(pool);
  }

  async findByEmail(email: string): Promise<{ id: number; name: string; email: string } | null> {
    const result = await this.pool.query<{ id: number; name: string; login: string }>(
      `SELECT ru.id, rp.name, ru.login
       FROM res_users ru JOIN res_partner rp ON rp.id = ru.partner_id
       WHERE ru.login = $1 LIMIT 1`,
      [email],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0]!;
    return { id: row.id, name: row.name, email: row.login };
  }
}
