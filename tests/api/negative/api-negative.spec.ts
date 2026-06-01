import { test, expect } from '@fixtures/test';
import { environment } from '@config/environment';

test.describe('@negative API Negative Cases', () => {
  test('@API-NEG-001 @api @negative @catalog impossible product filter returns empty result', async ({ httpClient }) => {
    const results = await httpClient.searchRead(
      'product.template',
      [['name', '=', 'XYZZY_NONEXISTENT_PRODUCT_99999_ABC']],
      ['id', 'name'],
      10,
    );

    expect(results).toHaveLength(0);
  });

  test('@API-NEG-002 @api @negative @catalog published products cannot have a negative price', async ({ httpClient }) => {
    const negativePrice = await httpClient.searchRead(
      'product.template',
      [['list_price', '<', 0], ['website_published', '=', true]],
      ['id', 'name', 'list_price'],
      10,
    );

    // Odoo should not allow published products with negative prices
    expect(negativePrice).toHaveLength(0);
  });

  test('@API-NEG-003 @api @negative @orders non-existent order reference returns empty result', async ({ httpClient }) => {
    const orders = await httpClient.searchRead(
      'sale.order',
      [['name', '=', 'S/NONEXISTENT/99999']],
      ['id', 'name', 'amount_total'],
      1,
    );

    expect(orders).toHaveLength(0);
  });

  test('@API-NEG-004 @api @negative @account invalid credentials return authentication failure', async () => {
    const url = `${environment.odooUrl}/web/session/authenticate`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: environment.dbName,
          login: 'nonexistent_user@invalid.com',
          password: 'wrong_password_xyz',
        },
      }),
    });

    const json = await response.json() as { result?: { uid: number | boolean } };
    // Odoo returns result.uid = false for failed auth
    expect(json.result?.uid).toBe(false);
  });
});
