# Playwright Quality Framework

E2E and API test automation framework targeting Odoo eCommerce.

## Quick Start

```bash
# Start Odoo
./scripts/start-odoo.sh

# Install deps
npm install
npx playwright install

# Run tests
npm run test:smoke   # fast smoke check
npm run test:e2e     # full business flows
npm run test:ui      # all UI tests
npm run test:api     # all API tests
```

## Architecture

See [docs/FRAMEWORK-ARCHITECTURE.md](docs/FRAMEWORK-ARCHITECTURE.md)

## Test Scenarios

See [docs/TEST-SCENARIOS.md](docs/TEST-SCENARIOS.md)

## Environment

Copy `.env.example` to `.env` and adjust values.
