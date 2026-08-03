# Visual CMS implementation plan

## Scope

Implement the approved visual CMS specification in vertical slices while preserving the existing public page and its current responsive behavior.

## Dependency order

1. **Content contract and defaults**
   - Extract current translations, contact settings, hero gallery, room galleries, and editable copy into a versioned content document.
   - Add strict normalization so old or partial documents safely inherit defaults.

2. **Authentication and storage foundation**
   - Add salted-password verification, signed HTTP-only sessions, protected routes, and login/logout actions.
   - Add a local development adapter plus private/public Vercel Blob adapters.
   - Add draft, published, revision, and image-upload operations.

3. **Shared public/editor rendering**
   - Make `HolidayHomePage` accept the content document and editor hooks.
   - Keep public behavior unchanged and isolate editor-only UI from `/`.

4. **Visual editing experience**
   - Add toolbar, editable-region pencil anchors, side panel/mobile sheet, text fields, language controls, image assignment/reordering, draft save, publish, and restore.

5. **Verification and setup documentation**
   - Add end-to-end tests for authentication and publishing isolation.
   - Run existing regression tests, lint, build, and screenshot inspection at desktop/mobile sizes.
   - Document local credentials, secure Vercel environment variables, and both Blob stores.

## Risks and mitigations

- **Existing uncommitted page changes:** patch only the current working files and never reset user work.
- **Content regression:** seed defaults directly from the current component, then compare public screenshots before and after.
- **Secret leakage:** generate the password hash and session secret only in ignored `.env.local`; commit placeholders only.
- **Vercel filesystem limitations:** local JSON is development-only; production mutations fail closed unless Blob tokens are configured.
- **Concurrent edits:** use ETags/expected revision identifiers and report conflicts instead of silently overwriting.
- **Mobile overlay overflow:** use viewport-safe fixed chrome and test 390px width plus safe-area insets.

## Verification checkpoints

1. Default content produces the unchanged public site.
2. Unauthenticated `/admin` redirects to login; correct credentials open the editor.
3. Draft text persists without changing `/`.
4. Publish updates `/` and creates a revision.
5. Editor controls align on desktop/mobile and the public page contains no editor markup.
6. Full lint, build, regression tests, and screenshot review pass.

