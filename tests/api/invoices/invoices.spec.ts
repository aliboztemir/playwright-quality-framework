import { test, expect } from '../../../src/fixtures/test';
import { InvoiceListService } from '../../../src/modules/invoices/services/InvoiceListService';

// Test 10
test('@api @functional @invoices customer invoices can be queried and have valid state', async ({ httpClient }) => {
  const service  = new InvoiceListService(httpClient);
  const invoices = await service.findCustomerInvoices(20);

  expect(invoices.length).toBeGreaterThan(0);

  const validStates = ['draft', 'posted', 'cancel'];
  for (const invoice of invoices) {
    expect(invoice.id).toBeGreaterThan(0);
    expect(invoice.name.length).toBeGreaterThan(0);
    expect(validStates).toContain(invoice.state);
    expect(invoice.amount_total).toBeGreaterThanOrEqual(0);
  }
});
