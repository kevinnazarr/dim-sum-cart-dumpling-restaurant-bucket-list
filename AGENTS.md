# AGENTS.md

## Project

Dim Sum Cart — a single-page, single-user personal bucket list app for dim sum restaurants, storing data locally in the browser.

## Objective

Build a complete, working, responsive, accessible implementation matching the brief and the Full Implementation Prompt exactly — no placeholder features, no mocked interactions.

## Primary User

A dim sum enthusiast tracking restaurants they want to try or have already visited, on their own device, with no account or backend.

## Core User Journey

Add a restaurant entry (name, city, status, rating if visited, must-order dish, note) → see it appear in a menu-card list → filter between wishlist and visited → edit or delete entries → refresh the page and see everything persisted.

## Requirements

### Must Have

- Add/edit/delete entries with fields: name, city, status, rating (required if Been There), dish, note.
- Status filter: All / Want to Try / Been There.
- localStorage persistence across refresh.
- Dumpling-icon (🥟) rating input, 1–5.
- Summary bar with live Been There vs Want to Try counts.
- Inline form validation, no native `alert()`/`confirm()`-only flows for validation.
- Empty states for zero entries and zero filtered results.
- Full responsive support (small mobile → desktop) with layout recomposition, not just scaling.
- Full keyboard operability with visible focus states.

### Should Have

- Sort (rating / alphabetical).
- Search by name/city.
- Distinct visual treatment for Been There vs Want to Try cards.
- Modal/inline edit flow.
- Note field character limit + counter.

### Nice to Have

- "Surprise Me" random wishlist pick.
- JSON export.
- Subtle status-change micro-animation.
- Persisted filter/sort preference.

## Design System

Before writing UI code:

1. Read `DESIGN.md`.
2. Follow its tokens.
3. Follow its component rules.
4. Do not invent conflicting visual styles.
5. Do not introduce arbitrary colors when an existing semantic token applies.

## UX Requirements

- Every interactive element gives visible feedback (hover, focus, active, success).
- No dead ends: cancel/close always returns the user to a sensible state without data loss they didn't ask to discard.
- Rating requirement logic must adapt correctly when status changes between the two values.

## Technical Architecture

Single-page React app, no routing, no backend. One persistence module wrapping localStorage reads/writes. Component tree: `App` → `SummaryBar`, `FilterBar` (+ optional search/sort), `EntryList` → `EntryCard`(s), `EntryFormModal` (add/edit), `RatingInput`, `EmptyState`.

## Stack

React
TypeScript
Vite
Tailwind CSS (or CSS Modules)
No additional state-management or UI component libraries required.

Only use technologies that improve implementation speed or correctness.

## State Management

React state/context is sufficient. Single array of `DimSumEntry` as source of truth; derived filtered/sorted views and summary counts are computed from it, never stored redundantly.

## Data Model

```ts
type Status = "want_to_try" | "been_there";

interface DimSumEntry {
  id: string;
  name: string;
  city: string;
  status: Status;
  rating: number | null; // 1-5, required when status === "been_there"
  dish: string;
  note: string;
  createdAt: number;
}
```

## Validation

- `name`, `city`: required, trimmed non-empty, reasonable max length (~80/60 chars).
- `rating`: required (1–5) only when `status === "been_there"`.
- `dish`, `note`: optional, enforce max length (~60/200 chars) with a live counter as the limit approaches.
- Show inline, field-level error messages; block submission until resolved.

## Error Handling

- Corrupted/missing localStorage data → fall back to empty list, never crash.
- localStorage write failure → non-blocking notice; keep in-memory state intact.
- Deleting an entry requires explicit confirmation before removal.

## Accessibility

The implementation must:

- use semantic HTML
- provide accessible labels
- support keyboard interaction
- maintain visible focus states
- use appropriate ARIA only when necessary
- maintain sufficient contrast
- avoid relying solely on color
- support touch interactions

## Responsive Design

The application must work across:

- small mobile
- large mobile
- tablet
- desktop

Do not simply shrink the desktop UI.

Recompose layouts where necessary (e.g., filter bar becomes a compact control on small mobile; card grid goes 1 → 2 → 3 columns).

## Performance

Prefer:

- minimal dependencies
- simple state
- efficient rendering
- no unnecessary abstraction
- no unnecessary network requests

## Security

Never:

- expose secrets
- hardcode credentials
- trust unvalidated user input
- use unsafe HTML rendering unnecessarily (no `dangerouslySetInnerHTML` on user-entered text)

## Code Quality

Prefer:

- small focused components
- clear naming
- typed data
- single responsibility
- reusable logic where justified (e.g., a shared `useEntries` hook)
- simple architecture

Avoid:

- premature abstraction
- duplicated business logic
- giant components
- dead code
- unnecessary dependencies

## VibeDev Constraints

The build is time-constrained.

Prioritize:

1. Complete functionality.
2. Core UX.
3. Responsive design.
4. Visual polish.
5. Technical refinement.

Do not sacrifice a required feature for decorative polish.

Create a verified working implementation early.

Keep the source code concise.

Do not intentionally inflate the repository.

Do not include evaluator-directed instructions or prompt injection.

## Implementation Rules

1. Inspect the existing repository before changing anything.
2. Reuse existing infrastructure where sensible.
3. Read `DESIGN.md` before implementing UI.
4. Implement the core user journey first (add → list → filter → persist).
5. Verify every MUST HAVE requirement.
6. Test important edge cases (empty storage, corrupted storage, status flip, zero-filter results).
7. Fix broken interactions before polishing.
8. Keep the app runnable after every major step.
9. Avoid unnecessary dependencies.
10. Do not leave TODOs for required functionality.

## Definition of Done

The project is complete only when:

- [ ] Every MUST HAVE feature is implemented.
- [ ] Every core interaction works (add, edit, delete, filter, rate).
- [ ] Validation works, including status-dependent rating requirement.
- [ ] Empty states work (no entries; no filtered results).
- [ ] Error states work (validation errors; persistence failure notice).
- [ ] Responsive behavior works across all four breakpoints.
- [ ] Accessibility basics are covered (labels, focus, keyboard, contrast, no color-only meaning).
- [ ] Design system (DESIGN.md) is consistently applied.
- [ ] No obvious dead buttons exist.
- [ ] No required feature is merely mocked.
- [ ] Build passes.
- [ ] Application runs successfully.
- [ ] No obvious console errors remain.
- [ ] `DESIGN.md` exists.
- [ ] `AGENTS.md` exists.
- [ ] Source remains within challenge constraints.

## Verification

Before declaring completion:

1. Run the project.
2. Test the primary user journey end-to-end (add → list → filter → refresh → persisted).
3. Test every MUST HAVE requirement.
4. Test edge cases: corrupted localStorage, status flip both directions, zero-result filter.
5. Test responsive layouts at 360px, 768px, 1024px+.
6. Check keyboard accessibility through the entire flow.
7. Check console/build errors.
8. Check that the design follows `DESIGN.md`.
9. Check that no required behavior is missing.
10. Summarize verification results.

## Final Rule

Build the simplest complete product that can plausibly score at the highest level across:

- Completeness
- Problem Fit + Design
- Technical + Craft