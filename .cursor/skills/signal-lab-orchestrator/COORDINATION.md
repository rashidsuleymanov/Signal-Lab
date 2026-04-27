## Subagent prompt templates (Signal Lab orchestrator)

### PRD Analysis (fast)

- Input: PRD text or `prdPath`
- Output: requirements, constraints, acceptance checklist

Prompt skeleton:

> Read the PRD at `<prdPath>`. Extract:
> 1) Requirements (bullets)
> 2) Constraints (stack/ports/endpoints)
> 3) Acceptance checklist
> Keep it concise. Return only the extracted artifacts.

### Codebase Scan (explore/fast, readonly)

> Scan the repo for existing implementation relevant to PRD `<prdPath>`.
> Return: file list, current behavior, missing pieces, risks.

### Decomposition (default)

> Decompose PRD `<prdPath>` into atomic tasks (5–10 min each).
> For each task: id, title, type, complexity, model (fast/default), dependencies.
> Target: 80% fast tasks.

### Reviewer (fast, readonly)

> Review the repo against acceptance criteria for PRD `<prdPath>`.
> Return PASS/FAIL per bullet, and concrete file-level feedback for failures.

### Implementer (fast/default)

> Apply reviewer feedback. Touch only necessary files. After changes, re-run the relevant checks.
