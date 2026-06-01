import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';

export type GuestAddress = {
  name:    string;
  email:   string;
  phone?:  string;
  street:  string;
  city:    string;
  zip:     string;
  country: string;
};

export class AddressStepPage extends BasePage {
  readonly path = '/shop/checkout';

  readonly confirmButton:          Locator;
  readonly deliveryAddressSection: Locator;

  // Guest form fields
  readonly guestNameInput:    Locator;
  readonly guestEmailInput:   Locator;
  readonly guestPhoneInput:   Locator;
  readonly guestStreetInput:  Locator;
  readonly guestCityInput:    Locator;
  readonly guestZipInput:     Locator;
  readonly guestCountrySelect: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmButton           = page.getByRole('button', { name: /confirm/i });
    this.deliveryAddressSection  = page.locator('#shipping_and_billing, .o_delivery_carrier_select').first();
    this.guestNameInput          = page.locator('input[name="name"]').first();
    this.guestEmailInput         = page.locator('input[name="email"]').first();
    this.guestPhoneInput         = page.locator('input[name="phone"]').first();
    this.guestStreetInput        = page.locator('input[name="street"]').first();
    this.guestCityInput          = page.locator('input[name="city"]').first();
    this.guestZipInput           = page.locator('input[name="zip"]').first();
    this.guestCountrySelect      = page.locator('select[name="country_id"]').first();
  }

  async confirmAddress(): Promise<void> {
    await this.confirmButton.click();
    await this.waitForReady();
  }

  async fillGuestAddress(address: GuestAddress): Promise<void> {
    await this.guestNameInput.fill(address.name);
    await this.guestEmailInput.fill(address.email);
    if (address.phone) await this.guestPhoneInput.fill(address.phone);
    await this.guestStreetInput.fill(address.street);
    await this.guestCityInput.fill(address.city);
    await this.guestZipInput.fill(address.zip);
    await this.guestCountrySelect.selectOption({ label: address.country });
    await this.waitForReady();
  }

  async expectAddressStepVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout/);
    await expect(this.confirmButton).toBeVisible();
  }
}
