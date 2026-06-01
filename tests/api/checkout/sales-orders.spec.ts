import { test, expect } from '../../../src/fixtures/test';
import { OdooModelClient } from '../../../src/framework/api/OdooModelClient';
import { SalesOrderService } from '../../../src/modules/checkout/services/SalesOrderService';
import { environment } from '../../../src/config/environment';

test('@api @functional @checkout sales order can be found by reference', async () => {
  const client = await OdooModelClient.authenticate(
    environment.odooUrl,
    environment.dbName,
    environment.adminEmail,
    environment.adminPassword,
  );
  const service = new SalesOrderService(client);
  const order = await service.findByReference('S00048');
  expect(order).not.toBeNull();
  expect(order?.state).toBe('sale');
});
