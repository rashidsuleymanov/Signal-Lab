---
description: Check local stack health (API/UI/metrics/Grafana)
---

Run these checks and report what passed/failed:

```bash
curl -sS http://localhost:3001/api/health
curl -sS http://localhost:3001/metrics | head -n 20
```

Then verify in browser:
- `http://localhost:3000` (UI)
- `http://localhost:3100` (Grafana)

If something is down:
- run `docker compose ps`
- run `docker compose logs --tail=200 backend`
