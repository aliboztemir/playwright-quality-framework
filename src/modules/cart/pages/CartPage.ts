import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';

export class CartPage extends BasePage {
  readonly path = '/shop/cart';

  // div.o_cart_product — one per cart line (NOT tr)
  readonly cartLines: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartLines     = page.locator('div.o_cart_product');
    this.checkoutButton = page.locator('a[href="/shop/checkout"]');
    this.emptyCartMessage = page.getByText(/your cart is empty/i);
  }

  private lineLocator(name: string): Locator {
    return this.cartLines.filter({
      has: this.page.locator('a[name="o_cart_line_product_link"] h6', { hasText: name }),
    });
  }

  async captureCartLines(): Promise<import('../../checkout/models/CartLine').CartLine[]> {
    const count = await this.cartLines.count();
    const lines: import('../../checkout/models/CartLine').CartLine[] = [];
    for (let i = 0; i < count; i++) {
      const line = this.cartLines.nth(i);
      const name = await line
        .locator('a[name="o_cart_line_product_link"] h6')
        .first()
        .innerText();
      const qty = parseInt(
        await line.locator('[name="website_sale_cart_line_quantity"] input.js_quantity').inputValue(),
        10,
      );
      const rawPrice = await line
        .locator('div.d-none.d-md-block [name="website_sale_cart_line_price"] .oe_currency_value')
        .first()
        .innerText();
      const unitPrice = parseFloat(rawPrice.replace(/[^\d.]/g, ''));
      lines.push({ name: name.trim(), quantity: qty, unitPrice });
    }
    return lines;
  }

  async getLineCount(): Promise<number> {
    return this.cartLines.count();
  }

  async updateQuantity(index: number, quantity: number): Promise<void> {
    // Desktop quantity input — inside [name="website_sale_cart_line_quantity"]
    const input = this.cartLines
      .nth(index)
      .locator('[name="website_sale_cart_line_quantity"] input.js_quantity');
    await input.fill(String(quantity));
    await input.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async removeLine(index: number): Promise<void> {
    // Desktop remove link — aria-label="Remove from cart"
    await this.cartLines
      .nth(index)
      .locator('[name="o_wsale_cart_line_button_container"] a.js_delete_product[aria-label="Remove from cart"]')
      .click();
    await this.page.waitForLoadState('networkidle');
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.waitForReady();
  }

  /** Unit price shown in the desktop column (d-none d-md-block). */
  async getLinePrice(name: string): Promise<number> {
    const raw = await this.lineLocator(name)
      .locator('div.d-none.d-md-block [name="website_sale_cart_line_price"] .oe_currency_value')
      .first()
      .innerText();
    return parseFloat(raw.replace(/[^\d.]/g, ''));
  }

  async getLineQuantity(name: string): Promise<number> {
    const val = await this.lineLocator(name)
      .locator('[name="website_sale_cart_line_quantity"] input.js_quantity')
      .inputValue();
    return parseInt(val, 10);
  }

  async getTotalAmount(): Promise<number> {
    // Right-side summary panel: "Total" row value
    const raw = await this.page
      .locator('tr:has(td:text-is("Total")) .oe_currency_value, .o_total_row .oe_currency_value, [data-order-total] .oe_currency_value')
      .first()
      .innerText();
    return parseFloat(raw.replace(/[^\d.]/g, ''));
  }

  async expectProductInCart(name: string): Promise<void> {
    await expect(this.lineLocator(name)).toBeVisible();
  }

  /**
   * Verifies a cart line by name, quantity and price.
   * @param exact - true for logged-in users (exact DB price), false for guests (pricelist-adjusted, ±5% tolerance)
   */
  async expectCartLineDetails(name: string, quantity: number, price: number, exact = false): Promise<void> {
    const line = this.lineLocator(name);
    await expect(line).toBeVisible();
    const actualQty = await this.getLineQuantity(name);
    const actualPrice = await this.getLinePrice(name);
    expect(actualQty).toBe(quantity);
    if (exact) {
      expect(actualPrice).toBeCloseTo(price, 2);
    } else {
      // Guest pricelist may vary — assert within 5% of expected
      expect(actualPrice).toBeGreaterThanOrEqual(price * 0.95);
      expect(actualPrice).toBeLessThanOrEqual(price * 1.05);
    }
  }

  async expectCartEmpty(): Promise<void> {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async expectCartVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/\/shop\/cart/);
  }
}
