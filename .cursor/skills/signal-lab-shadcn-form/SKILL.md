---
name: signal-lab-shadcn-form
description: Build a small form in Signal Lab UI using React Hook Form + TanStack Query + shadcn-style components.
---

## When to Use

Use this skill when you:
- add a new UI control that submits data to the backend
- need consistent loading/error UX (toasts, disabled buttons, refetch)

## Pattern

1. **React Hook Form**
   - `useForm({ defaultValues })`
   - `register(...)` for inputs

2. **TanStack Query**
   - `useMutation` for POST/PUT/DELETE
   - Refetch/invalidate related `useQuery` keys on success

3. **Toasts**
   - Use `sonner` (`toast.success`, `toast.error`)

4. **UI components**
   - Use components from `apps/frontend/src/components/ui/*` (Button/Card/Input)
   - Keep layout in Tailwind

## Minimal checklist

- Loading state on button (`disabled` + label change)
- Toast on success and error
- Error message uses backend `message` when available
