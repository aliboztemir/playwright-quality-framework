# Setup Guide

This document walks you through setting up and running the Playwright Quality Framework locally.

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Node.js | 20.x | Required for Playwright and TypeScript |
| npm | 10.x | Bundled with Node.js |
| Docker | 24.x | For running the Odoo test environment |
| Docker Compose | v2.x | Included in Docker Desktop |
| Git | any | For cloning the repository |

## 1. Clone the Repository

```bash
git clone https://github.com/aliboztemir/playwright-quality-framework.git
cd playwright-quality-framework
```

## 2. Install Dependencies

```bash
npm ci
npx playwright install --with-deps chromium
```

## 3. Start the Odoo Test Environment

The framework targets an Odoo 17 eCommerce instance. Use the provided scripts to start it:

```bash
# From the project root
bash scripts/start-odoo.sh
```

Or start it manually with Docker Compose (if you have a compose file in your Odoo environment):

```bash
docker compose up -d
```

Wait for Odoo to finish initializing (usually 30–60 seconds). You can verify it is ready by visiting `http://localhost:8069`.

## 4. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with the correct values for your Odoo instance:

```env
# Odoo connection
ODOO_URL=http://localhost:8069
ODOO_DB=odoo

# Admin credentials (Odoo admin user)
ADMIN_EMAIL=admin
ADMIN_PASSWORD=admin

# PostgreSQL direct connection (for DB verification layer)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=odoo
DB_USER=odoo
DB_PASSWORD=odoo_password
```

> **Tip:** The default values in `.env.example` match the standard Odoo Docker Compose setup. You likely do not need to change them.

## 5. Run the Tests

```bash
# All API tests (fast, no browser)
npm run test:api

# All UI tests (uses Chromium)
npm run test:ui

# Smoke tests only (fastest feedback)
npm run test:smoke

# Full E2E tests
npm run test:e2e

# Negative / error scenario tests
npm run test:negative
```

## 6. View Reports

### Playwright HTML Report

```bash
npm run report
```

Opens the built-in Playwright HTML report in your browser.

### Allure Report

```bash
# Generate the report from raw results
npm run allure:generate

# Open the generated report
npm run allure:open

# Or serve the results live (auto-refreshes)
npm run allure:serve
```

> **Note:** Allure requires Java to be installed (`java -version`). Download from [adoptium.net](https://adoptium.net/).

## 7. Type Checking

```bash
npm run type-check
```

No output means everything is clean.

## 8. Stop the Test Environment

```bash
bash scripts/stop-odoo.sh
```

---

## CI / GitHub Actions

The project includes two GitHub Actions workflows:

| Workflow | File | Trigger | Tests |
|----------|------|---------|-------|
| UI Tests | `.github/workflows/ui-tests.yml` | push / PR to `main`, `master` | `@smoke` tagged |
| API Tests | `.github/workflows/api-tests.yml` | push / PR to `main`, `master` | all API tests |

To enable CI for your own fork, add the following **repository secrets** under *Settings → Secrets and variables → Actions*:

| Secret | Description |
|--------|-------------|
| `ODOO_URL` | Base URL of the Odoo instance |
| `ODOO_DB` | Database name |
| `ODOO_ADMIN_EMAIL` | Admin username |
| `ODOO_ADMIN_PASSWORD` | Admin password |
| `PGHOST` | PostgreSQL host |
| `PGPORT` | PostgreSQL port |
| `PGDATABASE` | PostgreSQL database |
| `PGUSER` | PostgreSQL user |
| `PGPASSWORD` | PostgreSQL password |
