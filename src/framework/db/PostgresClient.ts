import { Pool, type PoolConfig, type QueryResult } from 'pg';
import { environment } from '../../config/environment';

let sharedPool: Pool | null = null;

export function getPool(): Pool {
  if (!sharedPool) {
    const config: PoolConfig = {
      host: environment.dbHost,
      port: environment.dbPort,
      database: environment.dbName,
      user: environment.dbUser,
      password: environment.dbPassword,
    };
    sharedPool = new Pool(config);
  }
  return sharedPool;
}

export async function query<T extends object>(
  sql: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  const pool = getPool();
  return pool.query<T>(sql, params);
}

export async function closePool(): Promise<void> {
  if (sharedPool) {
    await sharedPool.end();
    sharedPool = null;
  }
}
