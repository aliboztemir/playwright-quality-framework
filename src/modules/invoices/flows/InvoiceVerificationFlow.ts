import { expect, type Page } from '@playwright/test';
import type { Pool } from 'pg';
import { InvoicesPage } from '../../account/pages/InvoicesPage';
import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { InvoiceApiService } from '../services/InvoiceApiService';
import { urls } from '../../../config/urls';
import type { OdooModelClient } from '../../../framework/api/OdooModelClient';
import type { CheckoutResult } from '../../checkout/flows/CheckoutFlow';

export class InvoiceVerificationFlow {
  private readonly invoicesPage:  InvoicesPage;
  private readonly invoiceRepo:   InvoiceRepository;
  private readonly invoiceApi:    InvoiceApiService;

  constructor(
    private readonly page: Page,
    pool: Pool,
    apiClient: OdooModelClient,
  ) {
    this.invoicesPage = new InvoicesPage(page);
    this.invoiceRepo  = new InvoiceRepository(pool);
    this.invoiceApi   = new InvoiceApiService(apiClient);
  }

  /**
   * Verifies invoice if it exists. Skips silently if no invoice was generated.
   */
  async verifyIfExists(result: CheckoutResult): Promise<void> {
    const invoice = await this.invoiceRepo.findByOrderReference(result.orderReference);
    if (!invoice) {
      console.info(`[InvoiceVerification] No invoice found for order ${result.orderReference} — skipping invoice checks`);
      return;
    }

    await this.verifyInPortal(result, invoice.name);
    await this.verifyViaApi(result, invoice.name);
    await this.verifyInDb(result, invoice.name);
  }

  private async verifyInPortal(result: CheckoutResult, invoiceName: string): Promise<void> {
    await this.page.goto(urls.invoices);
    await this.invoicesPage.expectInvoiceVisible(invoiceName);
  }

  private async verifyViaApi(result: CheckoutResult, invoiceName: string): Promise<void> {
    const invoice = await this.invoiceApi.findByOrderReference(result.orderReference);
    expect(invoice, `Invoice for order ${result.orderReference} not found via API`).not.toBeNull();
    expect(invoice!.name).toBe(invoiceName);
    expect(['draft', 'posted']).toContain(invoice!.state);
    if (result.cartTotal !== null) {
      expect(invoice!.amountTotal).toBeCloseTo(result.cartTotal, 1);
    }
  }

  private async verifyInDb(result: CheckoutResult, invoiceName: string): Promise<void> {
    const invoice = await this.invoiceRepo.findByOrderReference(result.orderReference);
    expect(invoice, `Invoice for order ${result.orderReference} not found in DB`).not.toBeNull();
    expect(invoice!.name).toBe(invoiceName);
    expect(['draft', 'posted']).toContain(invoice!.state);
    if (result.cartTotal !== null) {
      expect(invoice!.amountTotal).toBeCloseTo(result.cartTotal, 1);
    }
    if (result.customerEmail) {
      expect(invoice!.partnerEmail?.toLowerCase()).toBe(result.customerEmail.toLowerCase());
    }
  }
}
