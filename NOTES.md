# TechCare Dashboard — learning notes

## Step 06 — diagnostic form, reducer, preferences context

- Native controlled form first: React owns every field value (`''` instead of `undefined`) so inputs never flip to uncontrolled.
- `useReducer` helped for related transitions: changing status away from `Untreated` clears `note` and its error in one action instead of scattered `setState` calls.
- Context here is transport for `compactView` only — not patients/search/API data (that stays props until Query in step 7).
- Split value/actions contexts so toggle handlers can be discussed separately from consumers that read `compactView`.

## Theme toggle

- Theme is client UI preference stored in `localStorage` and applied via `data-theme` on `<html>`.
- CSS variables in `tokens.css` switch under `[data-theme='dark']`; components should use tokens, not hardcoded colors.
- Inline script in `index.html` applies saved theme before React mounts to avoid flash of wrong theme.

## Step 07 — TanStack Query + real API

- Removed `useEffect` + manual fetch from App. One `usePatientsQuery()` with key `['patients']` owns server data.
- Query gives dedupe (multiple panels, one request), cache, retry, staleTime, and abort via `signal` without manual AbortController wiring.
- Selected patient is derived: `patients.find(id)` — not copied into separate state or a second query.
- Zod `safeParse` on API boundary; components never see snake_case DTO.
- Each data block has its own loading skeleton / error+retry / empty — not one global page spinner.
