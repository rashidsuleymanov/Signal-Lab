---
description: Add a new backend endpoint with DTO+Swagger+observability
---

Create a new endpoint under `apps/backend/src/` following existing patterns.

## Requirements

- DTO with `class-validator`
- Swagger annotations (`@ApiTags`, response decorators)
- Add structured logs via `LoggerService`
- If relevant, increment/observe metrics via `MetricsService`
- Add persistence via `PrismaService` if it represents a run/event

## After implementation

- Update `README.md` if it affects the verification walkthrough
- Run lint/test for backend if possible
