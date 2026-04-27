---
description: Verify observability signals for scenario runs (Prometheus/Loki/Sentry)
---

Goal: confirm that the “verification walkthrough” is still valid after changes.

## Steps

1. Start stack:

```bash
docker compose up -d
```

2. Trigger runs from UI: `success`, `slow_request`, `validation_error`, `system_error`.

3. Validate Prometheus metrics:

```bash
curl -sS http://localhost:3001/metrics | rg "scenario_runs_total|scenario_run_duration_seconds|http_requests_total"
```

4. Validate Grafana:
- open `http://localhost:3100` (admin/admin)
- dashboard: **Signal Lab — Scenarios** has data

5. Validate Loki:
- Grafana → Explore → Loki
- query: `{app="signal-lab"}`
- verify labels: `level`, `scenarioType`

6. Validate Sentry (only if DSN is configured):
- run `system_error`
- confirm exception captured
