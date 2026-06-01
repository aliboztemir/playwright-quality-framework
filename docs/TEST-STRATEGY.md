# Test Strategy

## Test Types

| Tag | Purpose | Scope |
|-----|---------|-------|
| `@smoke` | System up & critical paths work | ~5 tests, <2 min |
| `@e2e` | Full business flows end-to-end | ~7 tests, ~10 min |
| `@functional` | Feature-level regression | ~8 tests |
| `@api` | API contract validation | ~3 tests |
| `@negative` | Error and guard scenarios | ~3 tests |

## Run Commands

```bash
npm run test:smoke    # @smoke only
npm run test:e2e      # @e2e only
npm run test:ui       # all UI
npm run test:api      # all API
```
