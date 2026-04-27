---
description: Signal Lab stack constraints (do not substitute core tech)
---

## Must-use stack (hard constraint)

- **Frontend**: Next.js (App Router), Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form
- **Backend**: NestJS (TypeScript strict)
- **Data**: PostgreSQL 16 + Prisma (schema + migrations)
- **Observability**: Prometheus, Grafana, Loki, Sentry
- **Infra**: Docker Compose (`docker compose up -d` starts the whole stack)

## Not allowed (unless PRD explicitly asks)

- Replacing TanStack Query with SWR
- Replacing RHF with Formik
- Replacing shadcn/ui with another component library
- Replacing Prisma with another ORM (TypeORM/Sequelize/Drizzle) or raw SQL as the default path
- Replacing Prometheus/Loki/Grafana/Sentry with alternatives

## Port expectations (local)

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3100` (admin/admin)
- Loki (optional direct): `http://localhost:3101`
