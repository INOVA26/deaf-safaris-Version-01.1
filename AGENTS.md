# Deaf Safaris coding guide

## Project approach

- Build and review one page section at a time.
- Keep `Header.js`, `Hero.js`, each future section, and `Footer.js` as separate modules in `src/components/`.
- Assemble components in `src/main.js`; do not hide page order in unrelated files.
- Keep content factual. Use an explicit draft or placeholder when information has not been approved.
- Do not add bookings, payments, backend logic, external trackers, or unapproved third-party dependencies without discussion.

## Design and accessibility

- Start with mobile layouts, then enhance for larger screens.
- Use semantic HTML landmarks and heading levels.
- All interactive elements must work by keyboard and retain visible focus styles.
- Maintain readable colour contrast and respect `prefers-reduced-motion`.
- Use descriptive alternative text for approved imagery. Videos require captions before publishing.

## Styling

- Define shared colours, typography, spacing, radii, shadows, and transitions in `src/styles/tokens.css`.
- Put global rules in `src/styles/global.css` and component-specific rules in `src/styles/components.css`.
- Reuse the shared `.button` styles. Explain when a token or shared style change could affect another section.

## Before a commit

1. Run `npm run check`.
2. Run `npm run build`.
3. Review every diff in VS Code Source Control.
4. Update `docs/progress.md` with completed work and the next step.
5. Commit only reviewed files for the current milestone.
