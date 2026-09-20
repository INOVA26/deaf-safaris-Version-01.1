# Publishing Deaf Safaris

The source repository is on GitHub: `INOVA26/deaf-safaris-Version-01.1`.
The public website is hosted through Sites. `.openai/hosting.json` identifies
the hosting project. GitHub Actions runs tests, lint, formatting, and a production
build on pushes and pull requests. A successful GitHub check does not publish a
new Sites version; publish the reviewed commit separately through Sites.

## Build and review

1. Run `npm ci` after checking out the repository on a new computer.
2. Run `npm test`, `npm run check`, and `npm run build`.
3. Run `npm run preview` and open the printed address.
4. Review the mobile and desktop layouts, navigation, and contact links.
5. Commit reviewed files and push to GitHub.
6. Push the same commit to the source repository provided by Sites using a
   short-lived write credential, package `dist` with `.openai/hosting.json`, save
   a version, and deploy it. Verify the deployment reports success and the public
   address serves the expected site. Never save deployment tokens in files.

## Domain

The selected custom domain is `deafsafaris.tz`. Choosing the name does not
register it. Confirm ownership with the registrar before adding the domain to
Sites. Use the exact DNS and verification records returned by Sites, wait for
the domain and HTTPS certificate to become active, and then test the custom URL.
Keep the generated Sites address available until this is complete.

## Current release

- Email and WhatsApp open the visitor's external messaging service.
- Live support and the staff console require a separate backend and are excluded
  from the static public experience. They remain available during development.
- Reviews are explicitly labelled samples or saved on the visitor's device;
  review submission does not publish them for everyone.
- Mike's portrait is a placeholder pending the approved photograph.
- GitLab extensions are unnecessary for this GitHub repository. VS Code's built-in
  Git support plus the existing ESLint and Prettier recommendations are sufficient.

GitHub Pages is not the production host for this business website. Its usage
restrictions are documented at
<https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits>.
