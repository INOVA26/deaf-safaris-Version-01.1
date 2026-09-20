# Deaf Safaris

Deaf Safaris is a responsive safari website preview built with Vite and plain JavaScript. The homepage includes a photographic Hero, safari inspiration, a brand introduction, planning guidance, FAQs, and a local enquiry-brief builder. Business details awaiting approval are explicitly identified. The brief builder does not send messages or create bookings.

## Website organisation

- `src/main.js`: the visible page order and component initialisation.
- `src/components/`: one file per page section; `Brand.js` shares the approved logo between Header and Footer.
- `src/data/siteContent.js`: editable safari inspiration, planning steps, and FAQs.
- `src/data/photos.js`: local image imports, dimensions, and descriptive alternative text.
- `src/assets/images/`: locally hosted stock photography. The original user logo stays in `Images/`.
- `src/assets/fonts/`: locally hosted Inter variable font and its licence.
- `src/utils/`: plain-text brief generation, review validation/export, and the reusable typing animation, separate from section markup.
- `src/styles/tokens.css`: shared colours, type, spacing, and radii; `global.css`: shared controls and base styles; `components.css`: styles grouped by page section.
- `tests/`: brief output, internal destination, duplicate ID, input-label, and hero motion-policy checks using Node's test runner and Vite.
- `docs/`: progress, photography guidance, and source/licence records.

Run `npm run test` alongside `npm run check` and `npm run build` when changing the enquiry builder or page navigation. The brief form validates inputs in the browser, lets the visitor edit their answers, and downloads a `.txt` file on request. It has no backend or persistent storage.

Before publishing, approve the brand story, itineraries, contact details, and accessibility/service statements. Review desktop/mobile layouts, keyboard navigation, FAQ disclosures, and the complete brief/download flow. See [photo credits](docs/photo-credits.md) for the stock imagery; it does not depict confirmed company tours.

The [modern design refresh](docs/design-refresh.md) documents the transparent logo, Inter font, Jambo-inspired navigation, and hero animation controls. Hero scenes and captions are defined in `src/components/Hero.js`; photo files and descriptions are centralised in `src/data/photos.js`.

The Hero planning bar transfers preferences to the brief form. The Reviews section lets visitors select a rating, write a review, preview it, and download a text copy. Reviews stay in the current tab and are not submitted or published; live reviews require an approved service and moderation workflow. The shared layout uses 64px desktop side gutters, 16px mobile gutters, and 80px section spacing. Content is centred with a maximum width of 1280px; the header, Hero, sections, results, and Footer share this alignment.

## Requirements

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (Node 26 also works in this project)
- npm (installed with Node.js)
- Git, if you want to save milestones to GitHub

## Install and run locally

Open the integrated terminal in VS Code (`Terminal` > `New Terminal`) from the project folder, then run:

```bash
npm install
```

Downloads the development tools listed in `package.json` into `node_modules`. That folder is ignored by Git.

```bash
npm run dev
```

Starts Vite's local development server. Open the `Local` address it prints (normally `http://localhost:5173`) in a browser. Leave this terminal running while you work; Vite refreshes the browser after saved changes.

Press `Ctrl+C` in that terminal to stop the local server.

## Check and build

```bash
npm run check
```

Runs JavaScript linting and verifies formatting without changing files.

```bash
npm run format
```

Formats project files using Prettier.

```bash
npm run build
```

Creates an optimized production build in `dist/`. The output is ignored by Git.

```bash
npm run preview
```

Serves the built `dist/` folder locally so you can inspect the production build. Run `npm run build` first.

## Where to make changes

- Destination discovery below the Hero: `src/components/Destinations.js` and `src/data/destinations.js`. Content sources and interaction notes are in `docs/destination-content.md`.
- Safari search results and controls: `src/components/SafariResults.js`; URL preferences and filtering: `src/utils/safariSearch.js`.
- The Hero's **Search safaris** button opens `#safaris` with the selected preferences in the URL. Results show existing draft expeditions, with destination/category filters, sorting, and favourites held in memory until reload. Dates and sign-language choices remain preferences, not availability filters. **Edit search** restores the planner; **Create a brief** transfers the chosen journey and preferences while preserving visitor notes. No results means no matching draft itinerary; it does not indicate booking availability.
- Hero wording, rotating phrases, and scene captions: `src/components/Hero.js`
- Visitor review form and preview: `src/components/Reviews.js`
- Hero layout and visual styling: `src/styles/components.css`
- Shared colour, type, spacing, and button rules: `src/styles/tokens.css` and `src/styles/global.css`
- Page assembly order: `src/main.js`

Changing shared tokens or the shared `.button` class can affect future sections as well as the Hero.

## Finding and reviewing issues

- In VS Code, open **View** > **Problems** (or `Ctrl+Shift+M`) to see editor, ESLint, and syntax errors. Select an item to jump to it.
- In the browser, press `F12` and choose **Console** to see runtime JavaScript errors. Reload after correcting an error.
- Select the **Source Control** icon in VS Code's left sidebar to review each changed file and its red/green diff before staging or committing. Use the `+` only for files you have reviewed.

See `AGENTS.md` for project conventions and `docs/progress.md` for milestone status.

## Daily workspace workflow

1. **Start preview:** open this folder in VS Code. If `http://127.0.0.1:5173/` already shows this project, reuse it. Otherwise run **Tasks: Run Task** → **Deaf Safaris: Start development server** from the Command Palette (`Ctrl+Shift+P`). The task fixes port 5173 and fails if it is occupied rather than silently switching URLs. Stop a task with **Tasks: Terminate Task**.
2. **Edit one section:** open `src/components/Hero.js` and `src/styles/components.css` beside it. Save to format with the existing Prettier configuration; ESLint fixes run on explicit saves. Both extensions are recommended in `.vscode/extensions.json`. New sections belong in `src/components/`; use **Snippets: Insert Snippet** → **Deaf Safaris section** (prefix `ds-section`) in a JavaScript file, then import and place the section explicitly in `src/main.js`.
3. **Check:** run `npm run check` and `npm run build`. Named lint, formatting-check, combined-check, and production-build tasks are available. **Tasks: Run Build Task** (`Ctrl+Shift+B`) runs the production build. Use `npm run format` when you intentionally want to format the whole project.
4. **Review diff:** open **View: Show Source Control** (`Ctrl+Shift+G`) and select every changed file to inspect its diff. Update `docs/progress.md`. Stage only reviewed files for the current milestone; avoid staging everything while other work is unfinished.
5. **Commit:** enter a descriptive milestone message in Source Control and choose **Commit Staged**, or run `git commit -m "Describe the reviewed milestone"` after staging those files.
6. **Push:** use **Git: Push**, or `git push`, after reviewing the commit. If Git rejects a push, inspect incoming changes before deciding how to integrate them.

`node_modules/` and `dist/` are ignored by Git and hidden from Explorer and search. `package-lock.json` belongs in Git alongside `package.json`; commit lockfile updates when dependencies change. On a fresh checkout, use `npm ci` to install the locked versions.

## Debug and arrange the workspace

For an already running preview, select **Deaf Safaris: Debug existing preview (Edge)** in Run and Debug, then press `F5`. This opens a debug browser using the existing server. When no server is running, select **Deaf Safaris: Start server and debug (Edge)** instead. Set a breakpoint inside `Hero()` and refresh the debug browser to pause during rendering. Stopping browser debugging leaves the development server available for editing.

The debugger uses VS Code's [built-in Edge browser debugger](https://code.visualstudio.com/docs/nodejs/browser-debugging); no browser-debugging extension is needed. Vite serves the site; the installed Live Server extension is not needed for this project.

To arrange the workspace manually, run these exact Command Palette commands:

- **View: Show Explorer** opens Explorer. Workspace settings keep the primary sidebar on the left.
- Open `src/components/Hero.js` with `Ctrl+P`, then open `src/styles/components.css` with `Ctrl+P`. With the stylesheet active, run **View: Move Editor into Next Group** to place it beside the Hero. If it remains in one group, run **View: Split Editor Right** and select Hero in the left group.
- **Terminal: Create New Terminal** opens the integrated terminal. Existing user keyboard shortcuts are unchanged.
- **Simple Browser: Show**, then enter `http://127.0.0.1:5173/`, opens an editor preview. Alternatively open that URL in your normal browser.
- **View: Toggle Secondary Side Bar Visibility** shows the right sidebar. To place Codex there, right-click its view title and select **Move View** → **Secondary Side Bar** if that option is available in your extension version.

## File and commit history

Select a file in Explorer and expand **Timeline** at the bottom to see its Git commits and available local history. Select an entry to inspect that version or its changes. Git file history begins once the file has been committed; local history may also contain earlier saves.

Open **View: Show Source Control Graph** for the commit graph and select a commit to inspect its changed files. Terminal alternatives are `git log --oneline --graph --decorate --all` for repository history and `git log --follow -- src/components/Hero.js` for one file. Use `git show <commit>` to inspect a commit's patch. These are read-only history commands.
