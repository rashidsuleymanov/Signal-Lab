---
description: Observability conventions (metrics/logs/sentry) for Signal Lab
---

## Metrics (Prometheus)

- **Expose** metrics at `GET /metrics` (NOT under `/api`).
- Prefer **counters** for counts and **histograms** for latency.
- Required metric names for this repo:
  - `scenario_runs_total{type,status}`
  - `scenario_run_duration_seconds_bucket{type,le}` (+ `_sum`, `_count`)
  - `http_requests_total{method,path,status_code}`

## Structured logs (Loki)

- Log to **stdout** in **JSON**.
- Include these fields on every scenario log:
  - `scenarioType`, `scenarioId` (when available), `duration`, `error` (if any)
- Add stable labels for Loki querying:
  - Docker label `app=signal-lab`
  - Promtail should extract `level` and `scenarioType` as labels

## Sentry

- Configure via env: `SENTRY_DSN` (empty in `.env.example` is fine)
- **Only** `system_error` (5xx) must call `captureException`
- `validation_error` can add breadcrumb (optional)

## Demo-first rule

Any new scenario/endpoint must be verifiable by hand:
- "how to trigger"
- "where to see metric/log/error"
