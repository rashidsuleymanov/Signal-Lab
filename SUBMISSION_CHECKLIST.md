# Signal Lab — Submission Checklist

Заполни этот файл перед сдачей. Он поможет интервьюеру быстро проверить решение.

---

## Репозиторий

- **URL**: `https://github.com/rashidsuleymanov/Signal-Lab`
- **Ветка**: `main`
- **Время работы** (приблизительно): `4` часа

---

## Запуск

```bash
# Команда запуска:
cp .env.example .env
docker compose up -d

# Команда проверки:
curl http://localhost:3001/api/health
curl http://localhost:3001/metrics | head -n 20

# Команда остановки:
docker compose down

```

**Предусловия**:
- Docker Desktop (Linux engine)
- Node.js (если запускать не через Docker): `node -v` / `npm -v`

---

## Стек — подтверждение использования

| Технология | Используется? | Где посмотреть |
|-----------|:------------:|----------------|
| Next.js (App Router) | ☑ | `apps/frontend/src/app/*` |
| shadcn/ui | ☑ | `apps/frontend/src/components/ui/*` |
| Tailwind CSS | ☑ | `apps/frontend/src/app/globals.css`, Tailwind classes in `page.tsx` |
| TanStack Query | ☑ | `apps/frontend/src/app/providers.tsx`, `apps/frontend/src/app/page.tsx` |
| React Hook Form | ☑ | `apps/frontend/src/app/page.tsx` |
| NestJS | ☑ | `apps/backend/src/*` |
| PostgreSQL | ☑ | `docker-compose.yml` (`postgres` service) |
| Prisma | ☑ | `prisma/schema.prisma`, `apps/backend/src/prisma/*` |
| Sentry | ☑ (optional DSN) | `apps/backend/src/sentry/sentry.service.ts` |
| Prometheus | ☑ | `apps/backend/src/metrics/*`, `observability/prometheus/prometheus.yml` |
| Grafana | ☑ | `docker-compose.yml` (`grafana`), `observability/grafana/*` |
| Loki | ☑ | `docker-compose.yml` (`loki`,`promtail`), query `{app="signal-lab"}` |

---

## Observability Verification

Опиши, как интервьюер может проверить каждый сигнал:

| Сигнал | Как воспроизвести | Где посмотреть результат |
|--------|-------------------|------------------------|
| Prometheus metric | Run scenario in UI (`success`) | `http://localhost:3001/metrics` (`scenario_runs_total`) |
| Grafana dashboard | Run several scenarios | `http://localhost:3100` → dashboard **Signal Lab — Scenarios** |
| Loki log | Run scenario (`success` / `slow_request`) | Grafana → Explore → Loki: `{app="signal-lab"}` |
| Sentry exception | Set `SENTRY_DSN`, run `system_error` | Your Sentry project → Issues (captured exception) |

---

## Cursor AI Layer

### Custom Skills

| # | Skill name | Назначение |
|---|-----------|-----------|
| 1 | `signal-lab-observability` | Добавлять метрики/логи/Sentry к новым флоу |
| 2 | `signal-lab-nest-endpoint` | Шаблон нового Nest endpoint (DTO+Swagger+obs) |
| 3 | `signal-lab-shadcn-form` | Форма UI на RHF + TanStack Query + toasts |

### Commands

| # | Command | Что делает |
|---|---------|-----------|
| 1 | `/health-check` | Быстро проверить UI/API/metrics/Grafana и посмотреть логи |
| 2 | `/check-obs` | Пройти verification walkthrough observability |
| 3 | `/add-endpoint` | Добавить endpoint с DTO+Swagger+obs паттернами |

### Hooks

| # | Hook | Какую проблему решает |
|---|------|----------------------|
| 1 | `beforeShellExecution` → `check-shell-safety.js` | Предупреждает/блокирует деструктивные команды (force push, rm -rf, reset --hard) |
| 2 | `beforeShellExecution` → `ensure-env-for-compose.js` | Не даёт запускать `docker compose up` без `.env` (быстрый DX) |

### Rules

| # | Rule file | Что фиксирует |
|---|----------|---------------|
| 1 | `.cursor/rules/stack-constraints.md` | Жёсткие ограничения стека/портов |
| 2 | `.cursor/rules/observability-conventions.md` | Конвенции метрик/логов/Sentry |
| 3 | `.cursor/rules/prisma-patterns.md` | Prisma schema+migrations patterns |

### Marketplace Skills

| # | Skill | Зачем подключён |
|---|-------|----------------|
| 1 | docker-expert | Compose/debug контейнеров |
| 2 | nestjs-best-practices | Идиоматичные паттерны NestJS |
| 3 | prisma-orm | Prisma schema/migrations/query patterns |
| 4 | shadcn-ui | UI компоненты/паттерны |
| 5 | tailwind-design-system | Layout/tokens/patterns |
| 6 | next-best-practices | Next App Router best practices |

**Что закрыли custom skills, чего нет в marketplace:** repo-specific порты/эндпоинты, фиксированные названия метрик и требования verification walkthrough.

---

## Orchestrator

- **Путь к skill**: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- **Путь к context file** (пример): `.execution/2026-04-27-14-30/context.json`
- **Сколько фаз**: `7`
- **Какие задачи для fast model**: большинство atomic задач (DTO, endpoint scaffold, метрики/логи, UI компоненты)
- **Поддерживает resume**: да

---

## Скриншоты / видео

- [ ] UI приложения
- [ ] Grafana dashboard с данными
- [ ] Loki logs
- [ ] Sentry error

(Приложи файлы или ссылки ниже)

---

## Что не успел и что сделал бы первым при +4 часах

---

## Вопросы для защиты (подготовься)

1. Почему именно такая декомпозиция skills?
2. Какие задачи подходят для малой модели и почему?
3. Какие marketplace skills подключил, а какие заменил custom — и почему?
4. Какие hooks реально снижают ошибки в повседневной работе?
5. Как orchestrator экономит контекст по сравнению с одним большим промптом?
