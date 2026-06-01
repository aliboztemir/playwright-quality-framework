import { test, expect } from '@fixtures/test';
import { CustomerBuilder } from '@data/builders/CustomerBuilder';

test.describe('@auth Authentication — Negative', () => {
  test('@AUTH-003 @ui @negative @auth login with unknown email is rejected', async ({ app }) => {
    await app.auth.loginPage.open();
    await app.auth.loginPage.login('nonexistent_user_xyz@example.com', 'Test1234!');

    await app.auth.expectLoginError();
    await app.auth.expectAnonymous();
  });

  test('@AUTH-004 @ui @negative @auth login with empty password is rejected', async ({ app }) => {
    const customer = CustomerBuilder.random().build();
    await app.auth.registerCustomer(customer);
    await app.auth.logout();

    await app.auth.loginPage.open();
    await app.auth.loginPage.login(customer.email, '');

    await expect(app.auth.loginPage.errorMessage.or(app.auth.loginPage.passwordInput)).toBeVisible();
    await app.auth.expectAnonymous();
  });

  test('@AUTH-005 @ui @negative @auth duplicate email registration is rejected', async ({ app }) => {
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

  test('@AUTH-006 @ui @negative @auth submitting empty credentials stays on login page', async ({ app }) => {
    await app.auth.loginPage.open();
    await app.auth.loginPage.emailInput.fill('');
    await app.auth.loginPage.passwordInput.fill('');
    await app.auth.loginPage.submitButton.click();
    await app.auth.loginPage.waitForReady();

    await app.auth.loginPage.expectLoginError();
  });
});
