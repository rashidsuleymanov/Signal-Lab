## Signal Lab

Observability playground: **Next.js UI** + **NestJS API** + **Postgres/Prisma** that generates real signals in **Prometheus**, **Grafana**, **Loki**, and (optionally) **Sentry**.

### Prerequisites

- Docker Desktop (**Linux engine**)
- Node.js (only needed for local dev outside Docker)

### Quickstart

```bash
cp .env.example .env
docker compose up -d
```

### URLs

- UI (Next.js): `http://localhost:3000`
- API (NestJS): `http://localhost:3001`
- Swagger: `http://localhost:3001/api/docs`
- Prometheus metrics: `http://localhost:3001/metrics`
- Grafana: `http://localhost:3100` (admin/admin)
- Loki (optional direct): `http://localhost:3101`

### Verification walkthrough (target: 5–15 minutes)

1) Confirm API is alive:

```bash
curl http://localhost:3001/api/health
```

2) Open UI:
- `http://localhost:3000`

3) Run scenarios from UI:
- `success` → should show status `completed`
- `slow_request` → should complete, but with higher duration
- `validation_error` → should show warning status and toast error
- `system_error` → should show error status and toast error

4) Check Prometheus-format metrics:

```bash
curl http://localhost:3001/metrics
```

Look for:
- `scenario_runs_total`
- `scenario_run_duration_seconds_bucket`
- `http_requests_total`

5) Check Grafana dashboard:
- open `http://localhost:3100` (admin/admin)
- dashboard: **Signal Lab — Scenarios**

6) Check logs in Loki:
- Grafana → Explore → Loki datasource
- query: `{app="signal-lab"}`
- logs should have labels like `level` and `scenarioType`

7) (Optional) Sentry:
- set `SENTRY_DSN` in `.env`
- run `system_error`
- confirm exception captured in your Sentry project

### Notes

- Prisma migrations are committed under `prisma/migrations` and applied in the backend container via `prisma migrate deploy`.
- If Docker Desktop isn’t running, `docker compose up` will fail — start Docker first.

### Stop

```bash
docker compose down
```
