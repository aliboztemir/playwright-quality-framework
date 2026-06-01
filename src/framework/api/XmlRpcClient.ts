import * as https from 'https';
import * as http from 'http';

type XmlRpcPrimitive = string | number | boolean;
interface XmlRpcArray extends Array<XmlRpcValue> {}
interface XmlRpcObject extends Record<string, XmlRpcValue> {}
type XmlRpcValue = XmlRpcPrimitive | XmlRpcArray | XmlRpcObject;

export class XmlRpcClient {
  readonly serviceUrl: string;

  constructor(serviceUrl: string) {
    this.serviceUrl = serviceUrl;
  }

  async call(method: string, params: XmlRpcValue[]): Promise<XmlRpcValue> {
    const body = this.buildXmlBody(method, params);
    const response = await this.post(body);
    return this.parseXmlResponse(response);
  }

  private buildXmlBody(method: string, params: XmlRpcValue[]): string {
    const paramsXml = params.map((p) => `<param><value>${this.encodeValue(p)}</value></param>`).join('');
    return `<?xml version="1.0"?><methodCall><methodName>${method}</methodName><params>${paramsXml}</params></methodCall>`;
  }

  private encodeValue(value: XmlRpcValue): string {
    if (typeof value === 'string') return `<string>${value}</string>`;
    if (typeof value === 'number') return Number.isInteger(value) ? `<int>${value}</int>` : `<double>${value}</double>`;
    if (typeof value === 'boolean') return `<boolean>${value ? 1 : 0}</boolean>`;
    if (Array.isArray(value)) return `<array><data>${value.map((v) => `<value>${this.encodeValue(v)}</value>`).join('')}</data></array>`;
    if (typeof value === 'object') {
      const members = Object.entries(value)
        .map(([k, v]) => `<member><name>${k}</name><value>${this.encodeValue(v)}</value></member>`)
        .join('');
      return `<struct>${members}</struct>`;
    }
    return `<nil/>`;
  }

  private post(body: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = new URL(this.serviceUrl);
      const transport = url.protocol === 'https:' ? https : http;
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'text/xml', 'Content-Length': Buffer.byteLength(body) },
      };
      const req = transport.request(options, (res) => {
        let data = '';
        res.on('data', (chunk: string) => { data += chunk; });
        res.on('end', () => resolve(data));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  private parseXmlResponse(xml: string): XmlRpcValue {
    const match = xml.match(/<value>([\s\S]*?)<\/value>/);
    if (!match) throw new Error(`Invalid XML-RPC response: ${xml.slice(0, 200)}`);
    return match[1] as XmlRpcValue;
  }
}
