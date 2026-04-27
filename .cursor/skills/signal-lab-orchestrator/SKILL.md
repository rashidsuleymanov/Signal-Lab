---
name: signal-lab-orchestrator
description: PRD executor orchestrator for Signal Lab using subagents + context.json + resume.
---

## When to Use

Use this skill when you want Cursor to implement one of the PRDs under `prds/` in a **repeatable**, **resumable**, and **context-efficient** way.

Typical calls:
- "Run PRD 002"
- "Continue last execution from context.json"

## Core idea

The orchestrator does **coordination only**:
- reads/writes a persistent state file (`context.json`)
- delegates real work to subagents
- runs a review loop (up to 3 retries per domain)

## Execution directory & context file

On first run:
- create `.execution/<executionId>/`
- write `.execution/<executionId>/context.json`

`executionId` format: `YYYY-MM-DD-HH-mm` (local time) or any stable id.

### `context.json` shape

```json
{
  "executionId": "2026-04-27-14-30",
  "prdPath": "prds/002_prd-observability-demo.md",
  "status": "in_progress",
  "currentPhase": "analysis",
  "phases": {
    "analysis": { "status": "pending" },
    "codebase": { "status": "pending" },
    "planning": { "status": "pending" },
    "decomposition": { "status": "pending" },
    "implementation": { "status": "pending", "completedTasks": 0, "totalTasks": 0 },
    "review": { "status": "pending" },
    "report": { "status": "pending" }
  },
  "tasks": [],
  "signal": 42
}
```

## Phases (mandatory)

### Phase 1 — PRD Analysis (fast)

Output:
- requirements list
- constraints list (stack, ports, endpoints)
- acceptance criteria checklist

Write result into `context.json.phases.analysis.result`.

### Phase 2 — Codebase Scan (fast / explore)

Output:
- current structure summary
- relevant files list
- risks (missing pieces)

### Phase 3 — Planning (default)

Output:
- high-level plan (2–6 bullets)
- minimal critical path
- what to verify manually

### Phase 4 — Decomposition (default)

Produce atomic tasks (5–10 min each) with:
- `id`, `title`
- `type` (database/backend/frontend/infra/docs)
- `complexity` (low/medium/high)
- `model` (fast/default) — target: **80% fast**
- dependency notes

### Phase 5 — Implementation (mostly fast)

Delegate tasks in dependency order:
- DB → backend → infra → frontend → docs

Use existing skills where possible:
- `signal-lab-observability`
- `signal-lab-nest-endpoint`
- `signal-lab-shadcn-form`

### Phase 6 — Review (fast / readonly)

Per domain loop (max 3):
- run reviewer subagent (readonly)
- if failed: run implementer with feedback
- update context statuses

### Phase 7 — Report (fast)

Generate final report:
- tasks completed/failed
- retries count
- model usage distribution
- verification walkthrough

## Resume behavior (required)

If orchestrator is called again with an existing `context.json`:
- read it first
- skip completed phases
- continue from `currentPhase`
- do NOT recompute tasks if decomposition completed (unless explicitly asked)

## Subagent prompts

Use the following roles:
- **explore**: codebase scan, grep-like discovery
- **generalPurpose**: planning/decomposition/review
- **shell**: running commands, docker, tests

Keep prompts short and point to files/paths. Always ask the subagent to:
- return the file paths it touched
- return any commands run + outputs summary
- return a pass/fail checklist vs acceptance criteria

See `COORDINATION.md` for templates.
