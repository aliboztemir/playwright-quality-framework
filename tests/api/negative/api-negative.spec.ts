import { test, expect } from '../../../src/fixtures/test';

test.describe('API — Negative Cases', () => {
  test('@api @negative @catalog products query with impossible filter returns empty array', async ({ httpClient }) => {
    const results = await httpClient.searchRead(
      'product.template',
      [['name', '=', 'XYZZY_NONEXISTENT_PRODUCT_99999_ABC']],
      ['id', 'name'],
      10,
    );

    expect(results).toHaveLength(0);
  });

  test('@api @negative @catalog products with negative list_price are not in purchasable set', async ({ httpClient }) => {
    const negativePrice = await httpClient.searchRead(
      'product.template',
      [['list_price', '<', 0], ['website_published', '=', true]],
      ['id', 'name', 'list_price'],
      10,
    );

    // Odoo should not allow published products with negative prices
    expect(negativePrice).toHaveLength(0);
  });

  test('@api @negative @orders query for non-existent order reference returns empty', async ({ httpClient }) => {
    const orders = await httpClient.searchRead(
      'sale.order',
      [['name', '=', 'S/NONEXISTENT/99999']],
      ['id', 'name', 'amount_total'],
      1,
    );

    expect(orders).toHaveLength(0);
  });

  test('@api @negative @account non-admin login attempt via JSON-RPC returns error', async () => {
    const { environment } = await import('../../../src/config/environment');
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
