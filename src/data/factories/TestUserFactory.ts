import { CustomerBuilder } from '../builders/CustomerBuilder';
import type { Customer } from '../../modules/account/models/Customer';

export class TestUserFactory {
  static createGuestCustomer(): Customer {
    return CustomerBuilder.random().build();
  }

  static createNamedCustomer(name: string): Customer {
    return CustomerBuilder.random().withName(name).build();
  }
}
