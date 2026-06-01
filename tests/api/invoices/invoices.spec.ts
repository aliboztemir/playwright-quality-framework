import { test, expect } from '@fixtures/test';
import { InvoiceListService } from '@modules/invoices/services/InvoiceListService';

test.describe('@invoices Invoices API', () => {
  test('@API-INV-001 @api @functional @invoices customer invoices have valid structure and state', async ({ httpClient }) => {
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
});

