import { test as base } from '@playwright/test';
import { CatalogFlow } from '../modules/catalog/flows/CatalogFlow';
import { CartFlow } from '../modules/cart/flows/CartFlow';
import { CheckoutFlow } from '../modules/checkout/flows/CheckoutFlow';
import { AuthFlow } from '../modules/account/flows/AuthFlow';
import { MyAccountPage } from '../modules/account/pages/MyAccountPage';
import { OrdersPage } from '../modules/account/pages/OrdersPage';
import { OrderDetailsPage } from '../modules/account/pages/OrderDetailsPage';
import { InvoicesPage } from '../modules/account/pages/InvoicesPage';
import { NavigationFlow } from '../modules/shared/flows/NavigationFlow';
import { ProductRepository } from '../modules/catalog/repositories/ProductRepository';
import { ProductTestDataService } from '../modules/catalog/services/ProductTestDataService';
import { OrderVerificationFlow } from '../modules/orders/flows/OrderVerificationFlow';
import { InvoiceVerificationFlow } from '../modules/invoices/flows/InvoiceVerificationFlow';
import { OdooModelClient } from '../framework/api/OdooModelClient';
import { getPool } from '../framework/db/PostgresClient';
import { environment } from '../config/environment';

type AppFixture = {
  catalog:     CatalogFlow;
  cart:        CartFlow;
  checkout:    CheckoutFlow;
  auth:        AuthFlow;
  account: {
    dashboard:    MyAccountPage;
    orders:       OrdersPage;
    orderDetails: OrderDetailsPage;
    invoices:     InvoicesPage;
  };
  accountDashboard: MyAccountPage;
  nav:         NavigationFlow;
};

type Fixtures = {
  app:                 AppFixture;
  orderVerification:   OrderVerificationFlow;
  invoiceVerification: InvoiceVerificationFlow;
};

type WorkerFixtures = {
  productData: ProductTestDataService;
  apiClient:   OdooModelClient;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
  productData: [
    async ({}, use) => {
      const service = new ProductTestDataService(new ProductRepository(getPool()));
      await service.load();
      await use(service);
    },
    { scope: 'worker' },
  ],

  apiClient: [
    async ({}, use) => {
      const client = await OdooModelClient.authenticate(
        environment.odooUrl,
        environment.dbName,
        environment.adminEmail,
        environment.adminPassword,
      );
      await use(client);
    },
    { scope: 'worker' },
  ],

  app: async ({ page }, use) => {
    await use({
      catalog:  new CatalogFlow(page),
      cart:     new CartFlow(page),
      checkout: new CheckoutFlow(page),
      auth:     new AuthFlow(page),
      account: {
        dashboard:    new MyAccountPage(page),
        orders:       new OrdersPage(page),
        orderDetails: new OrderDetailsPage(page),
        invoices:     new InvoicesPage(page),
      },
      accountDashboard: new MyAccountPage(page),
      nav: new NavigationFlow(page),
    });
  },

  orderVerification: async ({ page, apiClient }, use) => {
    await use(new OrderVerificationFlow(page, getPool(), apiClient));
  },

  invoiceVerification: async ({ page, apiClient }, use) => {
    await use(new InvoiceVerificationFlow(page, getPool(), apiClient));
  },
});

export { expect } from '@playwright/test';

