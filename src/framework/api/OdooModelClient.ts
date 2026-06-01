import { XmlRpcClient } from './XmlRpcClient';

type OdooDomain = [string, string, unknown][];
type OdooKwArgs = Record<string, unknown>;

export class OdooModelClient {
  private readonly objectClient: XmlRpcClient;

  constructor(
    private readonly baseUrl: string,
    private readonly db: string,
    private readonly uid: number,
    private readonly password: string,
  ) {
    this.objectClient = new XmlRpcClient(`${baseUrl}/xmlrpc/2/object`);
  }

  async executeKw(
    model: string,
    method: string,
    args: unknown[],
    kwargs: OdooKwArgs = {},
  ): Promise<unknown> {
    return this.objectClient.call('execute_kw', [
      this.db,
      this.uid,
      this.password,
      model,
      method,
      args,
      kwargs,
    ] as unknown as Parameters<typeof this.objectClient.call>[1]);
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

  static async authenticate(baseUrl: string, db: string, user: string, password: string): Promise<OdooModelClient> {
    const commonClient = new XmlRpcClient(`${baseUrl}/xmlrpc/2/common`);
    const uid = await commonClient.call('authenticate', [db, user, password, {}] as unknown as Parameters<typeof commonClient.call>[1]);
    if (typeof uid !== 'number') throw new Error(`Authentication failed for user: ${user}`);
    return new OdooModelClient(baseUrl, db, uid, password);
  }
}
