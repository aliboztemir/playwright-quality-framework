import type { Page } from '@playwright/test';
import { CartPage } from '../../cart/pages/CartPage';
import { AddressStepPage } from '../pages/AddressStepPage';
import type { GuestAddress } from '../pages/AddressStepPage';
import { PaymentStepPage } from '../pages/PaymentStepPage';
import { PaymentStatusPage } from '../pages/PaymentStatusPage';
import type { CartLine } from '../models/CartLine';

export type CheckoutResult = {
  orderReference: string;
  rawReference:   string;
  paymentAmount:  number | null;
  cartTotal:      number | null;
  products:       CartLine[];
  customerName:   string;
  customerEmail:  string;
};

export class CheckoutFlow {
  readonly address: AddressStepPage;
  readonly payment: PaymentStepPage;
  private readonly cart: CartPage;
  private readonly status: PaymentStatusPage;

  constructor(private readonly page: Page) {
    this.cart    = new CartPage(page);
    this.address = new AddressStepPage(page);
    this.payment = new PaymentStepPage(page);
    this.status  = new PaymentStatusPage(page);
  }

  async completeRegisteredCheckout(
    customerName = '',
    customerEmail = '',
  ): Promise<CheckoutResult> {
    const products  = await this.cart.captureCartLines();
    const cartTotal = await this.cart.getTotalAmount().catch(() => null);

    await this.cart.proceedToCheckout();
    await this.address.expectAddressStepVisible();
    await this.address.confirmAddress();
    await this.payment.expectPaymentStepVisible();
    await this.payment.payWithDemo();
    await this.status.expectPaymentSuccess();

    const reference = await this.status.extractOrderReference();
    return {
      orderReference: reference ?? '',
      rawReference:   reference ?? '',
      paymentAmount:  null,
      cartTotal,
      products,
      customerName,
      customerEmail,
    };
  }

  async completeGuestCheckout(address: GuestAddress): Promise<CheckoutResult> {
    const products  = await this.cart.captureCartLines();
    const cartTotal = await this.cart.getTotalAmount().catch(() => null);

    await this.cart.proceedToCheckout();
    await this.address.expectAddressStepVisible();
    await this.address.fillGuestAddress(address);
    await this.address.confirmAddress();
    await this.payment.expectPaymentStepVisible();
    await this.payment.payWithDemo();
    await this.status.expectPaymentSuccess();

    const reference = await this.status.extractOrderReference();
    return {
      orderReference: reference ?? '',
      rawReference:   reference ?? '',
      paymentAmount:  null,
      cartTotal,
      products,
      customerName:  address.name,
      customerEmail: address.email,
    };
  }
}

