---
description: Frontend patterns (RHF + TanStack Query + shadcn/ui)
---

## Server state

- Use **TanStack Query** for API calls (`useQuery`, `useMutation`).
- Keep query keys stable and invalidate/refetch after mutations.

## Forms

- Use **React Hook Form** for any user input, even small forms.
- Validation: prefer backend validation + clear error messages; frontend can do basic constraints.

## UI components

- Prefer shadcn-style components under `apps/frontend/src/components/ui/*`.
- Use Tailwind for layout and spacing.
