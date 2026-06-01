import { test, expect } from '../../../src/fixtures/test';
import { PaymentProviderService } from '../../../src/modules/checkout/services/PaymentProviderService';

// Test 7
test('@api @smoke @payment demo payment provider exists and is in test mode', async ({ httpClient }) => {
  const service  = new PaymentProviderService(httpClient);
  const provider = await service.findDemoProvider();

  expect(provider).not.toBeNull();
  expect(provider!.code).toBe('demo');
  expect(provider!.state).toBe('test');
  expect(provider!.name).toBeTruthy();
});

// Test 8
test('@api @functional @payment no payment provider is in production (enabled) state', async ({ httpClient }) => {
  const service   = new PaymentProviderService(httpClient);
  const providers = await service.findAll();

  const productionProviders = providers.filter(p => p.state === 'enabled');
  expect(productionProviders.length).toBe(0);
});
