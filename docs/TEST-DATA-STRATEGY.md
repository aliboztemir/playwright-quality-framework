# Test Data Strategy

## Categories

| Category | Location | Usage |
|----------|----------|-------|
| Static known users | `src/data/testData/users.ts` | Portal/admin login |
| Static known products | `src/data/testData/products.ts` | Known product keywords |
| Runtime generated | `src/data/builders/` | Register, guest checkout |

## Principles

- Static seed data via TypeScript objects (not JSON)
- Runtime data via Builder pattern
- No raw SQL for test setup — use API or UI
- DB used only for post-state verification
