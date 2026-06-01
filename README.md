# Playwright Quality Framework

[![UI Tests](https://github.com/aliboztemir/playwright-quality-framework/actions/workflows/ui-tests.yml/badge.svg)](https://github.com/aliboztemir/playwright-quality-framework/actions/workflows/ui-tests.yml)
[![API Tests](https://github.com/aliboztemir/playwright-quality-framework/actions/workflows/api-tests.yml/badge.svg)](https://github.com/aliboztemir/playwright-quality-framework/actions/workflows/api-tests.yml)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![Playwright](https://img.shields.io/badge/playwright-1.60-blue)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

Production-grade E2E and API test automation framework for **Odoo 17 eCommerce**, built with Playwright and TypeScript. Demonstrates layered architecture, fixture-based dependency injection, JSON-RPC API testing, and multi-layer verification (UI + API + database).

---

## Test Coverage

| Category | Tests | Tags |
|----------|------:|------|
| UI — Authentication | 6 | `@smoke` `@negative` |
| UI — Product Catalog | 6 | `@smoke` `@functional` |
| UI — Cart Management | 7 | `@functional` `@negative` |
| UI — Checkout (E2E) | 6 | `@e2e` `@smoke` `@functional` |
| API — Products | 3 | `@smoke` `@functional` |
| API — Sales Orders | 3 | `@functional` |
| API — Customers | 3 | `@smoke` `@functional` |
| API — Payment Providers | 2 | `@smoke` `@functional` |
| API — Invoices | 1 | `@functional` |
| API — Pricelists | 1 | `@functional` |
| API — Negative Cases | 4 | `@negative` |
| **Total** | **42+** | |

---

## Architecture

```
playwright-quality-framework/
├── src/
│   ├── framework/          # Core abstractions (BasePage, BaseClient, OdooJsonRpcClient …)
│   ├── modules/            # Domain modules: catalog, cart, checkout, account, orders, invoices
│   │   └── <module>/
│   │       ├── pages/      # Page objects (locators + low-level actions)
│   │       ├── flows/      # Orchestration (multi-step user journeys)
│   │       ├── services/   # API service layer (Zod-validated responses)
│   │       ├── repositories/ # DB layer (PostgreSQL direct queries)
│   │       ├── models/     # TypeScript types
│   │       └── schemas/    # Zod schemas for runtime validation
│   ├── data/               # Builders (CustomerBuilder, AddressBuilder) + test data
│   ├── fixtures/           # Playwright fixture wiring (test.ts)
│   └── config/             # environment.ts, urls.ts, credentials.ts
├── tests/
│   ├── ui/                 # Browser tests by module
│   └── api/                # JSON-RPC API tests by module
├── docs/                   # Architecture, standards, setup, contributing …
└── .github/workflows/      # CI: ui-tests.yml, api-tests.yml
```

**Key design decisions:**
- **No assertions in page objects** — assertions live in tests or `assertions/` files
- **Fixture-injected dependencies** — `app`, `httpClient`, `apiClient`, `orderVerification` via `src/fixtures/test.ts`
- **Zod schemas on API boundaries** — runtime type safety for all Odoo JSON-RPC responses
- **Builder pattern for test data** — `CustomerBuilder.random().build()` generates unique users per test

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/aliboztemir/playwright-quality-framework.git
cd playwright-quality-framework

# 2. Install
npm ci
npx playwright install --with-deps chromium

# 3. Configure environment
cp .env.example .env   # edit values if needed

# 4. Start Odoo
bash scripts/start-odoo.sh

# 5. Run tests
npm run test:smoke      # fastest feedback — smoke tests only
npm run test:api        # all API tests (no browser needed)
npm run test:e2e        # full business E2E flows
npm run test:ui         # all UI tests
npm run test:negative   # error / negative scenarios

# 6. View reports
npm run report          # Playwright HTML report
npm run allure:serve    # Allure live report (requires Java)
```

---

## Running Specific Tests

```bash
# By tag
npx playwright test --grep "@smoke"
npx playwright test --grep "@negative"
npx playwright test --grep "@cart"

# By file
npx playwright test tests/ui/cart/cart-management.spec.ts
npx playwright test tests/api/checkout/sales-orders.spec.ts

# With headed browser (for debugging)
npx playwright test --headed tests/ui/checkout/e2e-checkout.spec.ts
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](docs/SETUP.md) | Step-by-step local setup and CI configuration |
| [FRAMEWORK-STANDARDS.md](docs/FRAMEWORK-STANDARDS.md) | 50 architectural rules and coding conventions |
| [FRAMEWORK-ARCHITECTURE.md](docs/FRAMEWORK-ARCHITECTURE.md) | Layer responsibilities and design decisions |
| [TEST-STRATEGY.md](docs/TEST-STRATEGY.md) | Test types, scope, and tagging conventions |
| [TEST-SCENARIOS.md](docs/TEST-SCENARIOS.md) | Full catalog of test scenarios by priority |
| [TEST-DATA-STRATEGY.md](docs/TEST-DATA-STRATEGY.md) | Builder pattern and test data lifecycle |
| [PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) | Annotated directory tree |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | PR checklist, commit conventions, coding standards |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common errors and fixes |

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev) | 1.60 | Browser automation and test runner |
| TypeScript | 6.x (strict) | Type safety |
| [Zod](https://zod.dev) | 3.23 | Runtime schema validation |
| [@faker-js/faker](https://fakerjs.dev) | 10.4 | Randomized test data |
| [pg](https://node-postgres.com) | 8.x | PostgreSQL direct queries |
| [allure-playwright](https://allurereport.org) | latest | Advanced test reporting |
| Docker + Docker Compose | 24.x | Odoo test environment |

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
ODOO_URL=http://localhost:8069
ODOO_DB=odoo
ADMIN_EMAIL=admin
ADMIN_PASSWORD=admin

DB_HOST=localhost
DB_PORT=5432
DB_NAME=odoo
DB_USER=odoo
DB_PASSWORD=odoo_password
```

See [docs/SETUP.md](docs/SETUP.md) for the full variable reference and CI secrets setup.
