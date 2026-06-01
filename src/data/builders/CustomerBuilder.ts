import { faker } from '@faker-js/faker';
import type { Customer } from '../../modules/account/models/Customer';

export class CustomerBuilder {
  private _name     = faker.person.fullName();
  private _email    = `test-${Date.now()}-${Math.floor(Math.random() * 9999)}@example.com`;
  private _password = 'Test1234!';

  static random(): CustomerBuilder {
    return new CustomerBuilder();
  }

  withName(name: string): this {
    this._name = name;
    return this;
  }

  withEmail(email: string): this {
    this._email = email;
    return this;
  }

  withPassword(password: string): this {
    this._password = password;
    return this;
  }

  build(): Customer {
    return { name: this._name, email: this._email, password: this._password };
  }
}
