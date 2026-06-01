import { test, expect } from '../../../src/fixtures/test';
import { OdooModelClient } from '../../../src/framework/api/OdooModelClient';
import { ProductService } from '../../../src/modules/catalog/services/ProductService';
import { environment } from '../../../src/config/environment';

test('@api @smoke @catalog purchasable products can be queried', async () => {
  const client = await OdooModelClient.authenticate(
    environment.odooUrl,
    environment.dbName,
    environment.adminEmail,
    environment.adminPassword,
  );
  const service = new ProductService(client);
  const products = await service.findPurchasableProducts();
  expect(products.length).toBeGreaterThan(0);
});
