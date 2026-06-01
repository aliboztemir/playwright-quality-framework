# Framework Architecture

## Layer Responsibilities

| Layer | Purpose |
|-------|---------|
| `tests/` | Executable test specs — behavior descriptions only |
| `flows/` | Business action orchestration |
| `pages/` | UI mechanics and locators |
| `components/` | Reusable UI fragments |
| `services/` | API business abstraction |
| `repositories/` | DB query abstraction |
| `schemas/` | Runtime data validation (Zod) |
| `fixtures/` | Dependency wiring |
| `config/` | Environment ownership |

## Core Principle

> Tests describe behavior. Flows orchestrate business actions. Pages/components handle UI mechanics. Services handle API behavior. Repositories handle DB access. Schemas validate runtime data. Fixtures wire dependencies. Config owns environment.
