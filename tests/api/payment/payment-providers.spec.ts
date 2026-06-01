import { test, expect } from '@fixtures/test';
import { PaymentProviderService } from '@modules/checkout/services/PaymentProviderService';

test.describe('Payment Providers API', () => {
  test('@api @smoke @payment demo payment provider exists and is in test mode', async ({ httpClient }) => {
    const service  = new PaymentProviderService(httpClient);
    const provider = await service.findDemoProvider();

    expect(provider).not.toBeNull();
    expect(provider!.code).toBe('demo');
    expect(provider!.state).toBe('test');
    expect(provider!.name).toBeTruthy();
  });

  test('@api @functional @payment no payment provider is in production (enabled) state', async ({ httpClient }) => {
    const service   = new PaymentProviderService(httpClient);
    const providers = await service.findAll();

    const productionProviders = providers.filter(p => p.state === 'enabled');
    expect(productionProviders.length).toBe(0);
  });
});

