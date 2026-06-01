# Contributing Guide

Thank you for contributing to the Playwright Quality Framework. This document describes the standards, conventions, and workflow you must follow before submitting a pull request.

---

## Branching Strategy

| Branch type | Naming pattern | Example |
|-------------|----------------|---------|
| Feature | `feat/<short-description>` | `feat/cart-quantity-validation` |
| Bug fix | `fix/<short-description>` | `fix/checkout-address-selector` |
| Documentation | `docs/<short-description>` | `docs/update-setup-guide` |
| Refactor | `refactor/<short-description>` | `refactor/extract-auth-flow` |
| Chore | `chore/<short-description>` | `chore/update-playwright` |

Branch from `master`. Never commit directly to `master`.

---

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`

**Examples:**

```
feat(cart): add CART-006 edge case for remove all items
fix(checkout): update address step selector for Odoo 17.1
docs(setup): add Allure Java requirement note
test(auth): add AUTH-005 duplicate registration negative test
```

---

## Code Standards

All code must follow the rules in [`docs/FRAMEWORK-STANDARDS.md`](./FRAMEWORK-STANDARDS.md). Key rules:

### TypeScript
- Strict mode is enforced (`tsconfig.json`). No `any`, no `unknown` without guard.
- Use path aliases (`@fixtures/`, `@data/`, etc.) — never relative `../../../`.
- All public methods must have explicit return types.

### Test Files
- Test IDs must match the scenario catalog (`docs/TEST-SCENARIOS.md`).
- Tests must have tags: at minimum one of `@smoke`, `@functional`, `@e2e`, `@negative`.
- No hardcoded credentials. Use `CustomerBuilder.random()` or `.env` environment variables.
- No `page.waitForTimeout()` without a comment explaining why it is unavoidable.
- No `test.only()` committed to the repository.

### Page Objects / Flows
- Page objects belong in `src/modules/<module>/pages/`.
- Flows belong in `src/modules/<module>/flows/`.
- No assertions inside page objects — assertions belong in tests or dedicated `assertions/` files.
- Locators must be declared as `readonly` properties in the constructor.

### API / Services
- All API calls must go through service classes in `src/modules/<module>/services/`.
- Response schemas must be validated with Zod.
- The `OdooJsonRpcClient` must be used via the `httpClient` fixture — never instantiated directly in tests.

---

## Adding a New Test

1. Check `docs/TEST-SCENARIOS.md` for an existing scenario ID. If none exists, add a new scenario there first.
2. Create the spec file under the correct directory:
   - UI tests → `tests/ui/<module>/<scenario>.spec.ts`
   - API tests → `tests/api/<module>/<scenario>.spec.ts`
3. Use `CustomerBuilder.random().build()` for any customer data.
4. Tag the test correctly (`@ui`/`@api`, priority tag, module tag).
5. Run type-check before committing: `npm run type-check`.

---

## Adding a New Page Object or Flow

1. Create the class in `src/modules/<module>/pages/` or `src/modules/<module>/flows/`.
2. Extend `BasePage` or use `BaseComponent` as appropriate.
3. Wire the new class into the fixture via `src/fixtures/test.ts` if tests need it.
4. Export it from the module's index if applicable.
5. Document any non-obvious selectors with a short comment.

---

## Pull Request Checklist

Before opening a PR, confirm:

- [ ] `npm run type-check` passes with no errors
- [ ] `npm run lint` passes (or violations are intentional and commented)
- [ ] All new tests have proper test IDs and tags
- [ ] No `login('', '')` or hardcoded credentials
- [ ] No `test.only()` left in code
- [ ] Relevant documentation updated (TEST-SCENARIOS.md, PROJECT-STRUCTURE.md)
- [ ] Commit messages follow Conventional Commits format

---

## Running Tests Before Submitting

```bash
# Type check
npm run type-check

# Run smoke tests to catch obvious breakage
npm run test:smoke

# Run API tests (fast, no browser needed)
npm run test:api
```
