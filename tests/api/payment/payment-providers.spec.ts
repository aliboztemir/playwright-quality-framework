import { test, expect } from '@fixtures/test';
import { PaymentProviderService } from '@modules/checkout/services/PaymentProviderService';

test.describe('@payment Payment Providers API', () => {
  test('@API-PAY-001 @api @smoke @payment demo provider is configured and in test mode', async ({ httpClient }) => {
    const service  = new PaymentProviderService(httpClient);
    const provider = await service.findDemoProvider();

    expect(provider).not.toBeNull();
    expect(provider!.code).toBe('demo');
    expect(provider!.state).toBe('test');
    expect(provider!.name).toBeTruthy();
  });

  test('@API-PAY-002 @api @functional @payment no payment provider is in production state', async ({ httpClient }) => {
    const service   = new PaymentProviderService(httpClient);
    const providers = await service.findAll();

    const productionProviders = providers.filter(p => p.state === 'enabled');
    expect(productionProviders.length).toBe(0);
  });
});

