import type { Address } from '../../types/common.types';
import { AddressBuilder } from './AddressBuilder';

export type CheckoutData = {
  deliveryAddress: Address;
  billingAddress: Address;
};

export class CheckoutDataBuilder {
  private deliveryAddress = new AddressBuilder().build();
  private billingAddress = new AddressBuilder().build();

  withDeliveryAddress(address: Address): this {
    this.deliveryAddress = address;
    return this;
  }

  withSameAddresses(): this {
    this.billingAddress = { ...this.deliveryAddress };
    return this;
  }

  build(): CheckoutData {
    return {
      deliveryAddress: this.deliveryAddress,
      billingAddress: this.billingAddress,
    };
  }
}
