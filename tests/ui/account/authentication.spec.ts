import { test } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';

test.describe('@auth Authentication', () => {
  test('@AUTH-001 @ui @smoke @auth registers, logs out, and logs back in successfully', async ({ app }) => {
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

  test('@AUTH-002 @ui @negative @auth invalid password is rejected at login', async ({ app }) => {
    const customer = CustomerBuilder.random().build();

    await app.auth.registerCustomer(customer);
    await app.auth.logout();

    await app.auth.login(customer.email, 'WrongPassword123!');
    await app.auth.expectLoginError();
    await app.auth.expectAnonymous();
  });
});