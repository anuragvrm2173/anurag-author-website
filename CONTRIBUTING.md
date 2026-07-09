# Contributing Guide

## 1. Branch Strategy

- main: production-ready branch.
- feature/*: new work branches.
- fix/*: bugfix branches.
- chore/*: maintenance branches.

Workflow:

1. Branch from main.
2. Keep commits scoped and focused.
3. Rebase or merge main before opening PR.
4. Require lint and build pass before merge.

## 2. Coding Conventions

- Maintain existing React architecture and route/layout structure.
- Prefer small, targeted changes over broad refactors.
- Reuse existing utilities and services before adding new abstractions.
- Keep code ASCII unless file already requires Unicode.
- Keep comments minimal and meaningful.
- Preserve established naming and folder conventions.

## 3. Component Patterns

- Keep UI components presentation-focused.
- Keep API and persistence logic in service modules.
- Keep shared behavior in hooks when reused by multiple components.
- Keep environment-driven behavior in service/config layers.
- Preserve fallback behavior for runtime resilience.

## 4. Security and URL Handling

- All dynamic external URLs must flow through src/utils/urlSafety.js.
- Do not introduce parallel URL sanitizer utilities.
- Do not weaken CSP or security headers without review.
- Keep integration compatibility for Supabase, analytics, and challenge scripts.

## 5. Accessibility Standards

For dialogs and modal interactions:

- role="dialog"
- aria-modal="true"
- aria-labelledby and aria-describedby where applicable
- Escape closes
- Focus trap while open
- Initial focus on open
- Focus restoration on close

## 6. Commit Message Style

Use concise, scoped messages:

- feat: add admin media URL sanitization
- fix: restore focus on purchase modal close
- docs: add operations and contributing guides
- chore: update release changelog

## 7. Release Process

1. Update CHANGELOG.md.
2. Run validation:
   - npm run lint
   - npm run build
3. Verify environment variables are documented and set.
4. Deploy preview build and run smoke tests.
5. Deploy production.
6. Post-release verify key routes, forms, admin login, and media.

## 8. Pull Request Checklist

- Scope is limited and justified.
- No duplicate abstractions added.
- Existing architecture preserved.
- Lint passes.
- Build passes.
- Security headers/CSP unaffected unless intentionally changed.
- URL sanitizer usage verified for new dynamic links.
- Accessibility validated for any new dialog interaction.
