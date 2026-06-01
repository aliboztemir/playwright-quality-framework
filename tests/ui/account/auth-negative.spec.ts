import { test, expect } from '../../../src/fixtures/test';
import { CustomerBuilder } from '../../../src/data/builders/CustomerBuilder';

test.describe('Authentication — Negative Cases', () => {
  test('@ui @negative @auth AUTH-003 login with non-existent email shows error', async ({ app }) => {
    await app.auth.loginPage.open();
    await app.auth.loginPage.login('nonexistent_user_xyz@example.com', 'Test1234!');

    await app.auth.expectLoginError();
    await app.auth.expectAnonymous();
  });

  test('@ui @negative @auth AUTH-004 login with empty password shows error', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);
    await app.auth.logout();

    await app.auth.loginPage.open();
    await app.auth.loginPage.login(customer.email, '');

    await expect(app.auth.loginPage.errorMessage.or(app.auth.loginPage.passwordInput)).toBeVisible();
    await app.auth.expectAnonymous();
  });

  test('@ui @negative @auth AUTH-005 duplicate registration with same email shows error', async ({ app }) => {
    const customer = CustomerBuilder.random().build();

    // First registration should succeed
    await app.auth.registerCustomer(customer);
    await app.auth.logout();

    // Second registration with the same email should fail
    await app.auth.registerPage.open();
    await app.auth.registerPage.nameInput.fill(customer.name);
    await app.auth.registerPage.emailInput.fill(customer.email);
    await app.auth.registerPage.passwordInput.fill(customer.password);
    await app.auth.registerPage.confirmPasswordInput.fill(customer.password);
    await app.auth.registerPage.submitButton.click();
    await app.auth.registerPage.waitForReady();

    await app.auth.registerPage.expectRegistrationError();
  });

  test('@ui @negative @auth AUTH-006 login with empty credentials stays on login page', async ({ app }) => {
    await app.auth.loginPage.open();
    await app.auth.loginPage.emailInput.fill('');
    await app.auth.loginPage.passwordInput.fill('');
    await app.auth.loginPage.submitButton.click();
    await app.auth.loginPage.waitForReady();

    await app.auth.loginPage.expectLoginError();
  });
});
