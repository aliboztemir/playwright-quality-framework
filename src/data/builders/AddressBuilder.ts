import type { Address } from '../../types/common.types';

export class AddressBuilder {
  private address: Address = {
    name: 'Test Customer',
    street: 'Calle Gran Via 1',
    city: 'Madrid',
    zip: '28013',
    country: 'Spain',
  };

  withStreet(street: string): this {
    this.address = { ...this.address, street };
    return this;
  }

  withCity(city: string): this {
    this.address = { ...this.address, city };
    return this;
  }

  build(): Address {
    return { ...this.address };
  }
}
