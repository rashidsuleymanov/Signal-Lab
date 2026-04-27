---
name: signal-lab-observability
description: Add metrics, structured logs, and Sentry capture to a new backend flow in Signal Lab.
---

## When to Use

Use this skill when you:
- add a **new scenario type** or a **new API endpoint** that should be observable in Grafana/Loki/Sentry
- change behavior that impacts metrics/logs

## Goal

After applying changes, an interviewer can:
- trigger the behavior from UI or curl
- see **metric** changes at `GET /metrics`
- see **logs** in Grafana Explore (Loki) using `{app="signal-lab"}`
- see **errors** in Sentry for 5xx (when DSN configured)

## Implementation Checklist (Backend)

1. **Metrics**
   - Increment `scenario_runs_total{type,status}`
   - Observe `scenario_run_duration_seconds` (seconds)
   - Ensure `GET /metrics` is reachable at `/metrics` (not under `/api`)

2. **Logs**
   - Log JSON to stdout via `LoggerService`
   - Include:
     - `scenarioType`
     - `scenarioId` (if persisted)
     - `duration`
     - `error` (if any)

3. **Sentry**
   - For 5xx flows: call `SentryService.captureException(error, extras)`
   - For 4xx flows: breadcrumb is ok, but do not flood Sentry

4. **Persistence**
   - Persist the run to Postgres via Prisma (`ScenarioRun`)
   - Keep status labels stable (`completed`, `validation_error`, `system_error`, `teapot`)

## Verification (5 minutes)

- Trigger scenario from UI:
  - `success`
  - `validation_error`
  - `system_error`
  - `slow_request`
- Check:
  - `http://localhost:3001/metrics` contains `scenario_runs_total`
  - `http://localhost:3100` dashboard "Signal Lab — Scenarios" shows lines
  - Grafana → Explore → Loki: `{app="signal-lab"}` shows JSON logs with `scenarioType`
  - Sentry shows captured exception for `system_error` (only if DSN set)
