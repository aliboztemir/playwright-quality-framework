import { test } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';

test.describe('Authentication', () => {
  test('@ui @smoke @auth AUTH-001 customer can register, logout and login again', async ({ app }) => {
    const customer = CustomerBuilder.random().build();

    await app.auth.registerCustomer(customer);
    await app.auth.expectAuthenticatedAs(customer.name);

    await app.accountDashboard.goto();
    await app.accountDashboard.expectLoaded(customer.name);

    await app.auth.logout();
    await app.auth.expectAnonymous();

    await app.auth.login(customer.email, customer.password);
    await app.auth.expectAuthenticatedAs(customer.name);
  });

  test('@ui @negative @auth AUTH-002 invalid password shows login error', async ({ app }) => {
    const customer = CustomerBuilder.random().build();

    await app.auth.registerCustomer(customer);
    await app.auth.logout();

    await app.auth.login(customer.email, 'WrongPassword123!');
    await app.auth.expectLoginError();
    await app.auth.expectAnonymous();
  });
});