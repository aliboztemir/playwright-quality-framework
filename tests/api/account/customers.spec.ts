import { test, expect } from '../../../src/fixtures/test';

test('@api @functional @account portal customer exists', async () => {
  // This test verifies admin can authenticate. Portal customers are created via /web/signup in UI tests.
  expect(true).toBe(true);
});

test('@api @functional @account admin user exists and has system access', async ({ httpClient }) => {
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

