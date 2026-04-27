---
description: Prisma usage patterns for Signal Lab
---

## Schema + migrations

- Canonical schema lives at `prisma/schema.prisma`.
- Migrations live in `prisma/migrations/*`.
- Backend uses Prisma CLI with `--schema ../../prisma/schema.prisma`.

## Allowed

- `PrismaService` wrapper and typed client usage (`this.prisma.model.create/findMany/...`).
- `migrate deploy` in Docker startup for reproducible env boot.

## Avoid

- Raw SQL as default (`$queryRaw`) unless explicitly justified.
- Ad-hoc schema changes without adding a migration.

## After schema change checklist

- Regenerate client: `npm run prisma:generate` (in `apps/backend`)
- Create/update migration and commit it
