import { expect, type Page } from '@playwright/test';
import type { Pool } from 'pg';
import { OrdersPage } from '../../account/pages/OrdersPage';
import { SalesOrderRepository } from '../../checkout/repositories/SalesOrderRepository';
import { SalesOrderService } from '../../checkout/services/SalesOrderService';
import { OrderLineRepository } from '../repositories/OrderLineRepository';
import type { OdooModelClient } from '../../../framework/api/OdooModelClient';
import type { CheckoutResult } from '../../checkout/flows/CheckoutFlow';

export class OrderVerificationFlow {
  private readonly ordersPage:          OrdersPage;
  private readonly orderRepo:           SalesOrderRepository;
  private readonly orderLineRepo:       OrderLineRepository;
  private readonly orderApiService:     SalesOrderService;

  constructor(
    private readonly page: Page,
    pool: Pool,
    apiClient: OdooModelClient,
  ) {
    this.ordersPage      = new OrdersPage(page);
    this.orderRepo       = new SalesOrderRepository(pool);
    this.orderLineRepo   = new OrderLineRepository(pool);
    this.orderApiService = new SalesOrderService(apiClient);
  }

  async verifyInPortal(result: CheckoutResult): Promise<void> {
    await this.page.goto('/my/orders');
    await this.ordersPage.expectOrderVisible(result.orderReference);
    await this.ordersPage.openOrder(result.orderReference);

    // Verify each product appears in the order detail page
    for (const product of result.products) {
      await expect(this.page.getByText(product.name, { exact: false })).toBeVisible();
    }
  }

  async verifyViaApi(result: CheckoutResult): Promise<void> {
    const order = await this.orderApiService.findByReference(result.orderReference);
    expect(order, `Order ${result.orderReference} not found via API`).not.toBeNull();
    expect(order!.name).toBe(result.orderReference);
    expect(order!.state).toMatch(/^(sale|done)$/);
    if (result.cartTotal !== null) {
      expect(order!.amountTotal).toBeCloseTo(result.cartTotal, 1);
    }
  }

  async verifyInDb(result: CheckoutResult): Promise<void> {
    const order = await this.orderRepo.findByReference(result.orderReference);
    expect(order, `Order ${result.orderReference} not found in DB`).not.toBeNull();
    expect(order!.name).toBe(result.orderReference);
    expect(['sale', 'done']).toContain(order!.state);

    if (result.cartTotal !== null) {
      expect(order!.amountTotal).toBeCloseTo(result.cartTotal, 1);
    }

    if (result.customerEmail) {
      expect(order!.partnerEmail?.toLowerCase()).toBe(result.customerEmail.toLowerCase());
    }

    const lines = await this.orderLineRepo.findByOrderReference(result.orderReference);
    expect(lines.length).toBeGreaterThan(0);

    for (const cartProduct of result.products) {
      const matchingLine = lines.find(l =>
        l.productName.toLowerCase().includes(cartProduct.name.toLowerCase()),
      );
      expect(
        matchingLine,
        `Product "${cartProduct.name}" not found in DB order lines`,
      ).toBeDefined();
      expect(matchingLine!.quantity).toBe(cartProduct.quantity);
    }
  }
}
