# Framework Standards

These rules serve as the **development guidelines** for this framework.
All contributors must follow them when adding or modifying code.

---

## General Architecture

### 1. `tests/` contains scenarios only

No raw locators, API calls or DB queries inside test files.

```typescript
// ❌ Bad
await page.locator('#search').fill('Desk');
await db.query('select * from sale_order');

// ✅ Good
await app.catalog.searchProduct('Desk');
const order = await db.salesOrders.findByReference(orderReference);
```

### 2. Test type is managed by tags, not folders

```typescript
// ❌ Bad
tests/ui/smoke/shop-smoke.spec.ts
tests/ui/e2e/checkout-e2e.spec.ts

// ✅ Good
tests/ui/catalog/product-catalog.spec.ts
tests/ui/checkout/registered-checkout.spec.ts

// Tag usage
test('@ui @smoke @catalog product catalog displays available products', async ({ app }) => {});
```

### 3. Folders follow business domains

```
catalog/    cart/    checkout/    account/
```

Do **not** create layer-based test folders (`pages/`, `api/`, `db/`). Those belong under `src/`, never `tests/`.

---

## `src/config/` Rules

### 4. Read env variables from a single location

```typescript
// ❌ Bad
const baseUrl = process.env.BASE_URL;

// ✅ Good
import { environment } from '@config/environment';
await page.goto(environment.baseUrl);
```

### 5. Missing env variables must fail early

```typescript
if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is required');
}
```

---

## `src/fixtures/` Rules

### 6. Tests always import from the custom fixture

```typescript
// ❌ Bad
import { test, expect } from '@playwright/test';

// ✅ Good
import { test, expect } from '@fixtures/test';
```

### 7. Fixtures act as lightweight dependency injection

```typescript
test('@ui @e2e registered customer checkout', async ({ app }) => {
  await app.auth.loginAsPortalCustomer();
  await app.checkout.completeRegisteredCheckout();
});
```

Business logic belongs in flow classes, not inside fixtures.

---

## `src/framework/core/` Rules

### 8. `BasePage` stays generic

No Odoo-specific business logic inside `BasePage`.

```typescript
// ✅ Correct
export abstract class BasePage {
  constructor(protected readonly page: Page) {}
  abstract readonly path: string;
  async open(): Promise<void> { await this.page.goto(this.path); }
}

// ❌ Wrong — move this to CheckoutFlow
async completeCheckout() {}
```

### 9. `BaseComponent` handles component behaviour only

```typescript
export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}
  async isVisible(): Promise<boolean> { return this.root.isVisible(); }
}
```

### 10. `BaseClient` handles low-level API concerns

Timeout, logging, error handling are fine. Business queries are not.

### 11. `BaseRepository` provides SQL helpers

Repository = query abstraction. No raw SQL in tests.

---

## Logging & Reporting Rules

### 12. Logger is for debugging, not assertions

```typescript
// ✅ OK
logger.info('Checkout completed', { orderReference });

// ❌ Not an assertion — don't rely on logs to verify behaviour
logger.info('Order exists');
```

### 13. Attach meaningful artifacts on failure

```typescript
await attachJson(testInfo, 'order-api-response', orderResponse);
```

Recommended attachments: API response, DB query result, order reference, cart summary, screenshots, trace.

---

## `src/framework/api/` Rules

### 14. XML-RPC client knows transport only

```typescript
// ❌ Bad
xmlRpcClient.findProducts();

// ✅ Good — business logic belongs in ProductService
xmlRpcClient.executeKw('product.template', 'search_read', args);
```

### 15. Tests never call XML-RPC directly

```typescript
// ❌ Bad
await odooModelClient.searchRead('product.template', ...);

// ✅ Good
await api.products.findPurchasableProducts();
```

---

## `src/framework/db/` Rules

### 16. DB is for verification and cleanup only

```typescript
// ✅ Acceptable
const order = await db.salesOrders.findByReference(orderReference);
expect(order.amountTotal).toBe(total);

// ❌ Bad — use API or UI for test data selection
const product = await db.products.findFirst();
await app.catalog.openProduct(product.name);
```

---

## `src/framework/validation/` Rules

### 17. TypeScript interfaces alone are not enough for API responses

Interfaces are compile-time. Use Zod for runtime validation.

```typescript
const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  list_price: z.number(),
});

const product = ProductSchema.parse(response);
```

---

## `src/modules/*/pages/` Rules

### 18. Page objects know page behaviour only

```typescript
// ✅ Good
await catalogPage.search('Desk');
await catalogPage.openFirstProduct();

// ❌ Bad — belongs in a flow
await catalogPage.completeCheckout();
```

### 19. Locators must not leak outside page objects

```typescript
// ❌ Bad
await catalogPage.productCards.first().click();

// ✅ Good
await catalogPage.openFirstProduct();
```

### 20. Simple assertions can stay in tests

```typescript
// ✅ OK
await expect(app.catalog.pageTitle).toBeVisible();
```

If a domain assertion repeats across tests, extract it to a helper.

---

## `src/modules/*/components/` Rules

### 21. Repeating UI parts become components

Examples: `Header`, `ProductCard`, `CartSummary`, `AddressCard`, `CheckoutSummary`, `OrderTable`

```typescript
// ❌ Bad
page.locator('.product-card').nth(0)

// ✅ Good
const card = await catalogPage.firstProductCard();
await card.open();
```

---

## `src/modules/*/flows/` Rules

### 22. Business flows live here

```typescript
await app.checkout.completeRegisteredCheckout();

class CheckoutFlow {
  async completeRegisteredCheckout(): Promise<CheckoutResult> {
    await this.cart.open();
    await this.checkout.confirmAddress();
    await this.payment.payWithDemoProvider();
    return this.status.extractResult();
  }
}
```

### 23. Flow return values must be typed

```typescript
// ❌ Bad
return { ref: any };

// ✅ Good
type CheckoutResult = {
  orderReference: string;
  totalAmount: number;
  products: CartLine[];
};
```

---

## `src/modules/*/services/` Rules

### 24. API business abstraction belongs here

```typescript
await api.products.findPurchasableProducts();
await api.orders.findByReference(orderReference);
```

Services use low-level clients. Tests never use clients directly.

---

## `src/modules/*/repositories/` Rules

### 25. DB queries belong in domain repositories

```typescript
class SalesOrderRepository {
  async findByReference(reference: string): Promise<SalesOrderRecord | null> {}
}
```

No raw SQL in tests.

---

## `src/modules/*/schemas/` Rules

### 26. API/DB response schemas live here

```typescript
export const SalesOrderSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount_total: z.number(),
});
```

Schema files validate data shape — they are not assertion files.

---

## `src/modules/*/models/` Rules

### 27. Domain models stay in their module

Examples: `Product.ts`, `SalesOrder.ts`, `Customer.ts`

If a type is shared across multiple modules, move it to:

```
src/types/common.types.ts
```

---

## `src/modules/*/assertions/` Rules

### 28. Don't create an assertions folder for every module

Only add one if you have repeating domain assertions.

```typescript
// ✅ Acceptable
assertCartTotalMatchesLines(cart);
assertOrderMatchesCheckoutResult(order, checkoutResult);

// ❌ Unnecessary
assertPageIsVisible(page);
```

---

## `src/data/` Rules

### 29. Use TypeScript objects and builders — not JSON

```typescript
// ❌ Bad
{ "email": "customer@example.com" }

// ✅ Good
export const portalUser = {
  email: environment.portalUserEmail,
  password: environment.portalUserPassword,
};
```

### 30. Runtime data is generated by builders

```typescript
const customer = new CustomerBuilder()
  .withRandomEmail()
  .withSpanishAddress()
  .build();
```

### 31. Static seed data and runtime data are separate

```
testData/users.ts          → static known users
builders/CustomerBuilder.ts → runtime generated user
```

---

## `tests/ui/` Rules

### 32. Test names describe behaviour

```typescript
// ❌ Bad
test('checkout test', async () => {});

// ✅ Good
test('@ui @e2e @checkout registered customer can complete checkout with demo payment', async ({ app }) => {});
```

### 33. Tests contain minimal implementation detail

```typescript
test('@ui @smoke @catalog product catalog displays available products', async ({ app }) => {
  await app.catalog.open();
  await app.catalog.expectCatalogReady();
});
```

### 34. Smoke tests are short

Smoke tests do not run full checkout flows. Their purpose:
- Is the environment up?
- Do critical UI pages open?
- Is it worth continuing to run deeper tests?

### 35. E2E tests cover business flows end-to-end

```typescript
const result = await app.checkout.completeRegisteredCheckout();
await app.account.orders.expectOrderVisible(result.orderReference);
```

---

## `tests/api/` Rules

### 36. API tests are independent of the browser

```typescript
test('@api @functional products can be queried', async ({ api }) => {
  const products = await api.products.findPurchasableProducts();
  expect(products.length).toBeGreaterThan(0);
});
```

### 37. API tests can validate configuration

```typescript
test('@api @smoke demo payment provider is enabled', async ({ api }) => {
  const provider = await api.paymentProviders.findDemoProvider();
  expect(provider.state).toBe('test');
});
```

---

## `test-product/` Rules

### 38. Odoo setup must be deterministic

```yaml
# ✅ Good
image: odoo:19.0

# ❌ Bad
image: odoo:latest
```

### 39. Never bypass Odoo business workflows

```
❌ Prohibited
- Creating orders via raw SQL
- Creating invoices via raw SQL
- Custom invoice hacks
- Patching Odoo core

✅ Acceptable
- Config via ORM / XML-RPC
- Standard module installation
- Test user/product provisioning
```

### 40. Init scripts must be idempotent

Running the same script twice must not create duplicate data.

```
1. search existing record
2. if exists → update
3. else → create
```

---

## `docs/` Rules

### 41. README alone is not enough

Minimum required docs:

```
FRAMEWORK-ARCHITECTURE.md
FRAMEWORK-STANDARDS.md       ← this file
TEST-STRATEGY.md
TEST-SCENARIOS.md
TEST-DATA-STRATEGY.md
PROJECT-STRUCTURE.md
```

### 42. Docs must stay in sync with code

If the README describes DB validation but the code doesn't have it, that's a red flag — especially for a portfolio project.

---

## `scripts/` Rules

### 43. Scripts must be short and safe

```bash
set -euo pipefail
```

Standard commands:

```
npm run test:ui
npm run test:api
npm run test:smoke
```

---

## `package.json` Rules

### 44. Keep a minimal, consistent script set

```json
{
  "scripts": {
    "test:ui":    "playwright test tests/ui",
    "test:api":   "playwright test tests/api",
    "test:smoke": "playwright test --grep @smoke",
    "test:e2e":   "playwright test --grep @e2e",
    "type-check": "tsc --noEmit",
    "lint":       "eslint .",
    "format":     "prettier --write ."
  }
}
```

---

## Code Quality Rules

### 45. Never use `any`

```typescript
// ❌ Bad
const response: any = await api.call();

// ✅ Good
const response = ProductSchema.parse(await api.call());
```

### 46. Eliminate magic strings

```typescript
// ❌ Bad
await page.goto('/shop');

// ✅ Good
await page.goto(urls.shop);
```

### 47. Hard waits are forbidden in tests

```typescript
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await expect(locator).toBeVisible();
```

### 48. Use stable locator strategies

Priority order:

1. `getByRole`
2. `getByLabel`
3. `getByText`
4. Semantic / data-testid locator
5. CSS selector (only if necessary)
6. XPath (last resort)

### 49. Tests must be independent

```
// ❌ Bad
Test 1 creates an order → Test 2 reads the same order

// ✅ Good
Each test creates its own data or uses a fixture
```

### 50. First version must not be over-engineered

Leave these for later:

- Global interceptor layer
- Custom matcher library
- Complex DI container
- Multi-browser matrix
- Visual testing
- Performance testing

---

## Core Principle

> **Tests describe behavior.**
> **Flows orchestrate business actions.**
> **Pages and components handle UI mechanics.**
> **Services handle API behavior.**
> **Repositories handle DB access.**
> **Schemas validate runtime data.**
> **Fixtures wire dependencies.**
> **Config owns the environment.**
