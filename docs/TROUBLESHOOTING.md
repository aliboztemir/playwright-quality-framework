# Troubleshooting Guide

This document covers the most common errors encountered when running the framework and how to fix them.

---

## 1. Tests fail with "ERR_CONNECTION_REFUSED" or timeout on navigation

**Symptom:** All tests time out immediately. The error mentions `http://localhost:8069`.

**Cause:** Odoo is not running.

**Fix:**
```bash
bash scripts/start-odoo.sh
# Wait ~60 seconds, then verify:
curl -s -o /dev/null -w "%{http_code}" http://localhost:8069
# Should return 200
```

---

## 2. `Auth failed: no uid in response` from OdooJsonRpcClient

**Symptom:** API tests throw `Auth failed: no uid in response` during fixture setup.

**Cause:** Admin credentials in `.env` are wrong, or the Odoo database name is incorrect.

**Fix:**
1. Open `.env` and verify `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `DB_NAME`.
2. Test manually:
   ```bash
   curl -X POST http://localhost:8069/web/session/authenticate \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"call","params":{"db":"odoo","login":"admin","password":"admin"}}'
   ```
   The response should contain `"uid": <number>` (not `false`).

---

## 3. TypeScript compilation errors after pulling changes

**Symptom:** `npm run type-check` or `npx tsc --noEmit` shows errors.

**Fix:**
```bash
rm -rf node_modules
npm ci
npm run type-check
```

If errors persist, check that your Node.js version is ≥ 20:
```bash
node --version
```

---

## 4. Playwright browser not found

**Symptom:** `Error: browserType.launch: Executable doesn't exist at .../chromium`

**Fix:**
```bash
npx playwright install --with-deps chromium
```

---

## 5. Tests pass locally but fail in CI

**Symptom:** Tests that pass locally fail in GitHub Actions.

**Common causes and fixes:**

| Cause | Fix |
|-------|-----|
| `headless: false` in config | Already set to `true` — ensure you haven't overridden it locally |
| Missing GitHub Secrets | Add all required secrets listed in `docs/SETUP.md` |
| Odoo not running in CI | CI workflows require an externally accessible Odoo instance — provide `ODOO_URL` secret pointing to it |
| Flaky timing | Increase `retries` in `playwright.config.ts` for CI (currently `2`) |

---

## 6. `Cannot find module '@fixtures/test'`

**Symptom:** TypeScript or Playwright cannot resolve path aliases.

**Fix:** Check `tsconfig.json` has the correct path mappings:
```json
"paths": {
  "@fixtures/*": ["src/fixtures/*"],
  "@data/*": ["src/data/*"]
}
```

Also ensure you're running tests via `npx playwright test` (which respects tsconfig paths) rather than `ts-node` directly.

---

## 7. Allure report is empty or missing test results

**Symptom:** `npm run allure:generate` produces an empty report.

**Cause:** Allure results are written to `allure-results/`. If tests were not run after installing `allure-playwright`, the folder may be empty.

**Fix:**
```bash
# Run tests first
npm run test:api

# Then generate and open
npm run allure:generate
npm run allure:open
```

If `allure` CLI is not found:
```bash
# Check Java is installed (required by Allure CLI)
java -version

# Or use the npm-bundled CLI
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

---

## 8. Cart tests fail with "empty cart" even after adding a product

**Symptom:** `getLineCount()` returns 0 immediately after `addToCart()`.

**Cause:** The add-to-cart action may not have navigated to the cart yet, or the cart page is cached.

**Fix:** Ensure the `CartFlow.openCart()` call includes a `page.waitForLoadState('networkidle')`. If the issue persists, check that the product is `website_published = true` and has stock available in Odoo.

---

## 9. Price mismatch between API and UI

**Symptom:** `product.list_price` from API differs from the price shown in the shop.

**Cause:** Odoo pricelists are applied per-customer based on country. The API returns `list_price` (base price), while the UI may display a pricelist-adjusted price.

**Fix:** This is expected behavior. Use `ProductTestDataService` which resolves the correct price for the active pricelist. Alternatively, verify the pricelist configuration in Odoo admin (`Sales → Configuration → Pricelists`).

---

## 10. `expectLoginError()` assertion fails on valid invalid-login test

**Symptom:** `AUTH-002` or `AUTH-003` fails because `errorMessage` locator is not found.

**Cause:** Odoo may show the error in a toast or a different `.alert` class depending on the version.

**Fix:** Check the current error selector by inspecting the login page HTML after a failed login. Update `LoginPage.errorMessage` locator if needed:
```typescript
// Current
this.errorMessage = page.locator('.alert-danger');

// Alternative if Odoo changed the class
this.errorMessage = page.locator('[class*="alert"]').first();
```
