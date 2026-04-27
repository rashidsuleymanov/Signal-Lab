---
name: signal-lab-nest-endpoint
description: Scaffold a new NestJS endpoint in Signal Lab with DTO validation, Swagger, logs, and metrics.
---

## When to Use

Use this skill when you need to add a new backend route under `apps/backend/src/*` and want it to be:
- consistent with existing modules
- observable (metrics/logs)
- documented in Swagger

## Guardrails

- Keep the global prefix `api` (routes are under `/api/*`), except `/metrics`.
- Use `class-validator` DTOs.
- Update Swagger decorators on controllers.

## Template

1. **Create DTO**
   - `apps/backend/src/<domain>/dto/<name>.dto.ts`
   - Use `class-validator` (`IsString`, `IsOptional`, `MaxLength`, etc.)

2. **Controller**
   - `apps/backend/src/<domain>/<domain>.controller.ts`
   - Decorate with `@ApiTags`, `@ApiOkResponse` / `@ApiCreatedResponse`

3. **Service**
   - `apps/backend/src/<domain>/<domain>.service.ts`
   - Inject `PrismaService`, `MetricsService`, `LoggerService`, `SentryService` if relevant

4. **Wiring**
   - Register controller/provider in `AppModule` (or create a dedicated module)

5. **Observability**
   - Add at least one `logger.info/warn/error` with stable fields
   - If it’s a scenario-like action: increment `scenario_runs_total`

## Quick smoke test

From host (after `docker compose up -d`):
- `curl http://localhost:3001/api/health`
- `curl http://localhost:3001/api/docs`
