---
description: Error handling conventions for backend + frontend
---

## Backend (NestJS)

- Use meaningful HTTP status codes:
  - 400 for validation errors
  - 418 for `teapot` easter scenario
  - 500 for unexpected system errors
- Keep response bodies consistent (at least: `statusCode`, `message`, `timestamp`, `path`).
- Do not swallow errors: log + (optionally) capture to Sentry for 5xx.

## Frontend

- Show errors to the user (toast and/or inline).
- Prefer surfacing backend `message` field when present.
