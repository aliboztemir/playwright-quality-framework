# Project Structure

Playwright + TypeScript E2E test framework for Odoo 19 eCommerce.

```
playwright-quality-framework/
│
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── playwright.config.ts
├── .env.example
├── .gitignore
│
├── src/
│   │
│   ├── config/
│   │   ├── environment.ts         # Env variable reading, defaults and validation
│   │   ├── urls.ts                # All page URL constants
│   │   └── credentials.ts        # Admin/portal user credential config
│   │
│   ├── fixtures/
│   │   └── test.ts                # Central Playwright fixture — wires app, api, db, verification flows
│   │
│   ├── framework/
│   │   │
│   │   ├── core/
│   │   │   ├── BasePage.ts        # Abstract page base class
│   │   │   ├── BaseComponent.ts   # Abstract component base class
│   │   │   ├── BaseClient.ts      # API client base class
│   │   │   ├── BaseRepository.ts  # DB repository base class
│   │   │   └── logger.ts          # Structured logging helper
│   │   │
│   │   ├── api/
│   │   │   ├── XmlRpcClient.ts    # Odoo XML-RPC low-level transport
│   │   │   └── OdooModelClient.ts # Generic model execute/search/read wrapper
│   │   │
│   │   ├── db/
│   │   │   └── PostgresClient.ts  # PostgreSQL connection and query client
│   │   │
│   │   ├── validation/
│   │   │   └── schemaValidator.ts # Zod parse/safeParse wrapper
│   │   │
│   │   ├── reporting/
│   │   │   └── attachments.ts     # Attachment helpers (screenshot, JSON, trace)
│   │   │
│   │   └── utils/
│   │       ├── currency.ts        # Currency parse and compare helpers
│   │       ├── dates.ts           # Date/time helpers
│   │       ├── retry.ts           # Polling and retry helper
│   │       └── strings.ts        # String normalization helpers
│   │
│   ├── modules/
│   │   │
│   │   ├── catalog/
│   │   │   ├── pages/
│   │   │   │   ├── CatalogPage.ts           # /shop product listing page
│   │   │   │   └── ProductDetailsPage.ts    # Product detail page
│   │   │   ├── components/
│   │   │   │   └── ProductCard.ts           # Product card component
│   │   │   ├── flows/
│   │   │   │   └── CatalogFlow.ts           # Search, open product flows
│   │   │   ├── services/
│   │   │   │   ├── ProductService.ts        # Product XML-RPC/API service
│   │   │   │   └── ProductTestDataService.ts
│   │   │   ├── schemas/
│   │   │   │   └── product.schema.ts        # Zod product schema
│   │   │   └── models/
│   │   │       ├── Product.ts               # Product type
│   │   │       └── ProductTestData.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── pages/
│   │   │   │   └── CartPage.ts              # Cart page — add/remove/update/capture lines
│   │   │   ├── components/
│   │   │   │   └── CartSummary.ts           # Cart totals component
│   │   │   ├── flows/
│   │   │   │   └── CartFlow.ts              # Cart management flows
│   │   │   ├── assertions/
│   │   │   │   └── cartAssertions.ts        # Domain cart assertion helpers
│   │   │   └── models/
│   │   │       └── CartItem.ts              # Cart item type
│   │   │
│   │   ├── checkout/
│   │   │   ├── pages/
│   │   │   │   ├── CheckoutPage.ts          # General checkout page
│   │   │   │   ├── AddressStepPage.ts       # Address step (registered + guest)
│   │   │   │   ├── PaymentStepPage.ts       # Payment step
│   │   │   │   └── PaymentStatusPage.ts     # Payment result / confirmation page
│   │   │   ├── components/
│   │   │   │   ├── AddressCard.ts           # Delivery/billing address card
│   │   │   │   └── CheckoutSummary.ts       # Checkout total/summary component
│   │   │   ├── flows/
│   │   │   │   └── CheckoutFlow.ts          # completeRegisteredCheckout / completeGuestCheckout
│   │   │   ├── services/
│   │   │   │   └── SalesOrderService.ts     # Sales order API service
│   │   │   ├── repositories/
│   │   │   │   └── SalesOrderRepository.ts  # Sales order DB queries
│   │   │   ├── schemas/
│   │   │   │   └── salesOrder.schema.ts     # Zod sales order schema
│   │   │   └── models/
│   │   │       ├── SalesOrder.ts            # SalesOrder type (with partner info)
│   │   │       └── CartLine.ts              # CartLine type (name, qty, unitPrice)
│   │   │
│   │   ├── account/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.ts             # Login page
│   │   │   │   ├── RegisterPage.ts          # Register page
│   │   │   │   ├── MyAccountPage.ts         # My Account dashboard
│   │   │   │   ├── OrdersPage.ts            # My Orders list page
│   │   │   │   ├── OrderDetailsPage.ts      # Order detail page
│   │   │   │   └── InvoicesPage.ts          # My Invoices list page (/my/invoices)
│   │   │   ├── flows/
│   │   │   │   └── AuthFlow.ts              # Login, registerCustomer flows
│   │   │   ├── services/
│   │   │   │   └── CustomerService.ts       # Customer API service
│   │   │   ├── repositories/
│   │   │   │   └── CustomerRepository.ts    # Customer DB queries
│   │   │   ├── schemas/
│   │   │   │   └── customer.schema.ts       # Zod customer schema
│   │   │   └── models/
│   │   │       └── Customer.ts              # Customer type
│   │   │
│   │   ├── orders/
│   │   │   ├── flows/
│   │   │   │   └── OrderVerificationFlow.ts # verifyInPortal / verifyViaApi / verifyInDb
│   │   │   ├── models/
│   │   │   │   └── OrderLine.ts             # OrderLine type (productName, qty, subtotal)
│   │   │   └── repositories/
│   │   │       └── OrderLineRepository.ts   # sale_order_line DB queries
│   │   │
│   │   ├── invoices/
│   │   │   ├── flows/
│   │   │   │   └── InvoiceVerificationFlow.ts # Conditional verifyIfExists
│   │   │   ├── models/
│   │   │   │   └── Invoice.ts               # Invoice type (id, name, amountTotal, state)
│   │   │   ├── repositories/
│   │   │   │   └── InvoiceRepository.ts     # account_move DB queries via sale_order_invoice_rel
│   │   │   └── services/
│   │   │       └── InvoiceApiService.ts     # Invoice API service (sale.order → account.move)
│   │   │
│   │   └── shared/
│   │       ├── components/
│   │       │   ├── Header.ts                # Header/navbar component
│   │       │   └── SearchOverlay.ts         # Global search overlay
│   │       └── flows/
│   │           └── NavigationFlow.ts        # Common navigation helpers
│   │
│   ├── data/
│   │   ├── builders/
│   │   │   ├── CustomerBuilder.ts           # Random customer data builder (faker)
│   │   │   ├── AddressBuilder.ts            # Address data builder
│   │   │   └── CheckoutDataBuilder.ts       # Checkout form data builder
│   │   ├── factories/
│   │   │   └── TestUserFactory.ts           # Static/runtime test user factory
│   │   └── testData/
│   │       ├── users.ts                     # Known portal/admin users
│   │       ├── products.ts                  # Known product names and keywords
│   │       └── addresses.ts                 # Default address data
│   │
│   └── types/
│       ├── common.types.ts                  # Shared types: Currency, Address, Nullable
│       └── global.d.ts                      # Global type extensions
│
├── tests/
│   │
│   ├── ui/
│   │   ├── catalog/
│   │   │   ├── product-catalog.spec.ts      # Catalog listing and product visibility
│   │   │   ├── product-search.spec.ts       # Product search UI tests
│   │   │   └── catalog-filters.spec.ts      # Filter and sorting tests
│   │   ├── cart/
│   │   │   └── cart-management.spec.ts      # Add/remove/update cart UI tests
│   │   ├── checkout/
│   │   │   ├── registered-checkout.spec.ts  # Registered customer checkout flow
│   │   │   ├── checkout-address.spec.ts     # Address step UI tests
│   │   │   ├── checkout-payment.spec.ts     # Payment step and demo provider tests
│   │   │   └── e2e-checkout.spec.ts         # CHK-E2E-001/002/003 — full E2E with portal+API+DB
│   │   └── account/
│   │       ├── authentication.spec.ts       # Login / logout / invalid login tests
│   │       └── orders.spec.ts               # My Account order visibility tests
│   │
│   └── api/
│       ├── catalog/
│       │   └── products.spec.ts             # Product API / XML-RPC tests
│       ├── checkout/
│       │   └── sales-orders.spec.ts         # Sales order API tests
│       └── account/
│           └── customers.spec.ts            # Customer API tests
│
├── test-product/
│   └── odoo/
│       └── docker-compose.yml               # Odoo 19 + PostgreSQL local test environment
│
├── docs/
│   ├── FRAMEWORK-ARCHITECTURE.md            # Architecture decisions and layer responsibilities
│   ├── FRAMEWORK-STANDARDS.md              # Development guidelines and rules (this repo's law)
│   ├── TEST-STRATEGY.md                     # Test scope, types and execution strategy
│   ├── TEST-SCENARIOS.md                    # UI/API scenario catalogue
│   ├── TEST-DATA-STRATEGY.md                # Test data management and lifecycle
│   └── PROJECT-STRUCTURE.md                # This file — directory layout and file purposes
│
├── scripts/
│   ├── start-odoo.sh
│   ├── stop-odoo.sh
│   ├── test-ui.sh
│   ├── test-api.sh
│   └── test-smoke.sh
│
└── .github/
    └── workflows/
        ├── ui-tests.yml
        └── api-tests.yml
```
