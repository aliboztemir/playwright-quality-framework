import { test, expect } from '@fixtures/test';

test.describe('Customers API', () => {
  test('@api @smoke @account admin user exists and has system access', async ({ httpClient }) => {
    const users = await httpClient.searchRead(
      'res.users',
      [['login', '=', 'admin']],
      ['id', 'name', 'login', 'share'],
      1,
    );

    expect(users.length).toBe(1);
    const admin = users[0];
    expect(admin['login']).toBe('admin');
    expect(admin['share']).toBe(false); // internal user, not portal
  });

  test('@api @functional @account portal users have share flag set to true', async ({ httpClient }) => {
    const portalUsers = await httpClient.searchRead(
      'res.users',
      [['share', '=', true]],
      ['id', 'login', 'share', 'partner_id'],
      10,
    );

    for (const user of portalUsers) {
      expect(user['share']).toBe(true);
      expect(user['id']).toBeGreaterThan(0);
    }
  });

  test('@api @functional @account res.partner records exist for registered users', async ({ httpClient }) => {
    const partners = await httpClient.searchRead(
      'res.partner',
      [['customer_rank', '>', 0]],
      ['id', 'name', 'email', 'customer_rank'],
      5,
    );

    expect(partners.length).toBeGreaterThan(0);
    for (const partner of partners) {
      expect(partner['id']).toBeGreaterThan(0);
      expect(partner['customer_rank']).toBeGreaterThan(0);
    }
  });
});

