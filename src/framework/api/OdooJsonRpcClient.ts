import { environment } from '../../config/environment';

type OdooDomain = ([string, string, unknown] | string)[];

interface JsonRpcResponse<T = unknown> {
  jsonrpc: string;
  id: number | null;
  result?: T;
  error?: { code: number; message: string; data: unknown };
}

export class OdooJsonRpcClient {
  private readonly cookie: string;

  private constructor(
    private readonly baseUrl: string,
    cookie: string,
  ) {
    this.cookie = cookie;
  }

  static async authenticate(
    baseUrl: string,
    db: string,
    login: string,
    password: string,
  ): Promise<OdooJsonRpcClient> {
    const res = await fetch(`${baseUrl}/web/session/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        id: 1,
        params: { db, login, password },
      }),
    });

    if (!res.ok) throw new Error(`Auth failed: HTTP ${res.status}`);

    const data = (await res.json()) as JsonRpcResponse<{ uid: number }>;
    if (data.error) throw new Error(`Auth error: ${data.error.message}`);
    if (!data.result?.uid) throw new Error(`Auth failed: no uid in response`);

    const setCookie = res.headers.get('set-cookie') ?? '';
    const sessionCookie = setCookie.split(';')[0];
    return new OdooJsonRpcClient(baseUrl, sessionCookie);
  }

  async executeKw(
    model: string,
    method: string,
    args: unknown[],
    kwargs: Record<string, unknown> = {},
  ): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}/web/dataset/call_kw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: this.cookie,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        id: 1,
        params: { model, method, args, kwargs },
      }),
    });

    if (!res.ok) throw new Error(`call_kw failed: HTTP ${res.status}`);

    const data = (await res.json()) as JsonRpcResponse;
    if (data.error) throw new Error(`RPC error on ${model}.${method}: ${data.error.message}`);
    return data.result;
  }

  async searchRead(
    model: string,
    domain: OdooDomain,
    fields: string[],
    limit = 100,
  ): Promise<Record<string, unknown>[]> {
    const result = await this.executeKw(model, 'search_read', [domain], { fields, limit });
    return result as Record<string, unknown>[];
  }

  static fromEnvironment(): Promise<OdooJsonRpcClient> {
    return OdooJsonRpcClient.authenticate(
      environment.odooUrl,
      environment.dbName,
      environment.adminEmail,
      environment.adminPassword,
    );
  }
}
