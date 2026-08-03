# Visual CMS tasks

- [x] Create the versioned content schema and current defaults.
  - Acceptance: Current public copy, images, room details, links, and translations are represented without changing output.
  - Verify: Build plus public-page regression tests.
  - Files: `content/defaultContent.js`, `lib/cms/schema.js`, `components/HolidayHomePage.js`

- [x] Add secure single-user authentication.
  - Acceptance: `hhbedit` can sign in with the configured hash; invalid credentials fail generically; `/admin` and mutations require a valid signed cookie.
  - Verify: Authentication Playwright tests and manual cookie inspection.
  - Files: `lib/cms/auth.js`, `app/actions/cms.js`, `app/admin/login/page.js`, `app/admin/page.js`

- [x] Add local and Vercel Blob content storage.
  - Acceptance: Draft, published content, immutable revisions, and image uploads persist in the correct environment without exposing secrets.
  - Verify: Storage unit/route behavior plus local save/read/publish test.
  - Files: `lib/cms/content.js`, `lib/cms/schema.js`, `.env.example`, `.gitignore`

- [x] Make the public page read published CMS content.
  - Acceptance: `/` uses published content, falls back safely to defaults, and never exposes drafts or editor controls.
  - Verify: Public-vs-draft Playwright assertions.
  - Files: `app/page.js`, `components/HolidayHomePage.js`

- [x] Build the visual editor over the shared page.
  - Acceptance: Pencil controls edit approved text/image regions in all four languages; draft, preview, publish, restore, and logout work.
  - Verify: Core editor workflow E2E test and keyboard checks.
  - Files: `components/cms/*`, `components/HolidayHomePage.js`, `app/globals.css`

- [x] Complete responsive and visual QA.
  - Acceptance: No editor/public overflow, blocked controls, or mismatched editor anchors at desktop and 390px mobile widths.
  - Verify: Screenshot capture, `view_image`, existing regression suite, lint, and production build.
  - Files: `tests/cms.spec.js`, `tests/site.spec.js`, documentation
