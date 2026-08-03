# Spec: Holiday Home Bhaktapur Visual CMS

## Objective

Build a secure, single-user visual CMS for the existing single-page Holiday Home Bhaktapur website. The client signs in at `/admin`, sees the real website layout, and uses clearly positioned pencil controls to edit approved content without being able to alter or break the design.

The public page at `/` must continue to use the same `HolidayHomePage` components. The visual editor must not be a separately maintained copy of the website.

### Primary user

- One non-technical property administrator.
- Username is supplied through `CMS_USERNAME` and initially set to `hhbedit`.
- The supplied password is never committed or exposed to the browser. Only its salted hash is stored in environment configuration.

### Editable content

- English, German, French, and Spanish page copy.
- Hero title and description.
- Intro section title, description, and amenity labels.
- Room names, descriptions, availability labels, feature labels, and slideshow images.
- Location title and description.
- Booking-section copy and customer-facing labels.
- Footer description, WhatsApp numbers, map URL, and optional booking-platform URLs.
- Image alt text and hero/room slideshow ordering.

Rates and availability that already come from the Google Sheet remain outside this CMS.

### Editor workflow

1. Visit `/admin/login` and sign in.
2. View the actual responsive page with an editor toolbar and pencil controls anchored to editable elements.
3. Click a pencil to open a focused side panel for that element.
4. Edit the currently selected language or image collection.
5. Save changes as a draft.
6. Preview the draft at desktop and mobile widths.
7. Publish explicitly to update the public page.
8. Restore a previous published revision if needed.

## Tech Stack

- Next.js 16.2 App Router and React 19.2, matching the existing project.
- Existing CSS and `HolidayHomePage` component remain the visual source of truth.
- Next.js Server Components for public and editor content reads.
- Server Actions for login, logout, draft saves, publishing, and revision restore.
- `@vercel/blob` private storage for draft, published content, and revision JSON snapshots.
- `@vercel/blob` public storage for uploaded website images.
- Node `crypto` for salted password verification and signed session cookies; no OpenAI API or OpenAI key.

## Commands

```powershell
npm.cmd install
npm.cmd run dev -- --hostname 0.0.0.0
npm.cmd run lint
npm.cmd run build
npx.cmd playwright test
```

## Project Structure

```text
app/
  admin/
    login/page.js             # Secure login screen
    page.js                   # Authenticated visual editor route
  actions/cms.js              # Authenticated CMS mutations
  page.js                     # Public page loading published content
components/
  HolidayHomePage.js          # Shared public/editor presentation
  cms/
    VisualEditor.js           # Editor state and page composition
    EditorToolbar.js          # Draft/publish/preview/logout controls
    EditableRegion.js         # Reusable pencil anchor and focus behavior
    EditorPanel.js            # Field and image editing side panel
content/
  defaultContent.js           # Versioned fallback and schema defaults
lib/cms/
  auth.js                     # Password and signed-cookie helpers
  content.js                  # Blob/local storage adapter
  schema.js                   # Validation, normalization, and size limits
tests/
  cms.spec.js                 # Authentication and editor workflow E2E tests
docs/
  visual-cms-spec.md          # This specification
tasks/
  plan.md                     # Approved implementation plan
  todo.md                     # Verifiable implementation tasks
```

## Code Style

- Continue the repository's JavaScript and functional React conventions.
- Keep server-only authentication and storage code out of Client Components.
- Address content by stable semantic paths rather than DOM position or CSS selectors.

```js
<EditableRegion
  contentPath="translations.en.heroTitle"
  label="Edit hero title"
  enabled={editorMode}
  onEdit={openEditor}
>
  <h1>{content.translations.en.heroTitle}</h1>
</EditableRegion>
```

`contentPath` is the stable contract between the page and editor. Layout changes may move the component, but they must preserve or intentionally update this contract and its pencil-anchor placement.

## Data and Publishing Model

- `cms/draft.json`: latest saved draft in private Blob storage.
- `cms/published.json`: current public content in private Blob storage.
- `cms/revisions/<timestamp>.json`: immutable published snapshots.
- `cms-media/<timestamp>-<safe-filename>`: immutable uploaded images in public Blob storage.
- New installations fall back to `content/defaultContent.js` until the first draft is saved and published.
- Publishing validates the full document, creates a revision snapshot, writes the published version, and revalidates `/` and `/admin`.
- Writes use Blob ETags where available to prevent silently overwriting a newer edit.

## Authentication and Security

- The username and salted password hash live only in environment variables.
- The supplied plaintext password must not appear in committed files, browser JavaScript, HTML, logs, or error messages.
- Successful login creates an HTTP-only, Secure-in-production, SameSite=Lax signed session cookie with an eight-hour expiry.
- `/admin` and every CMS mutation verify the session server-side.
- Login failures use a generic response and are rate-limited.
- State-changing operations validate their payload, enforce maximum text/image sizes, and reject unknown content paths.
- Image uploads accept only JPEG, PNG, or WebP and use immutable random names.
- Public visitors cannot read drafts, revisions, credentials, or private Blob URLs.
- No free-form HTML, JavaScript, CSS, layout, font, or arbitrary URL injection is permitted.

## Editor Design System

- The website itself is the editor canvas; no duplicate mock website is created.
- Pencil buttons use one consistent compact circular treatment with visible keyboard focus and accessible labels.
- Desktop editing uses a fixed side panel that does not cover the selected content.
- Mobile editing uses a bottom sheet and keeps all page carousels and floating controls inside the viewport.
- Editable regions receive only a subtle dashed hover/focus outline while editor mode is active.
- A top toolbar clearly distinguishes `Draft`, `Saving`, `Saved`, `Published`, and `Error` states.
- Editor chrome uses the existing Newari-inspired timber, brick, marigold, and lime-washed palette without modifying the public design.

## Testing Strategy

### Automated

- ESLint and production build must pass.
- Playwright verifies failed and successful login, session protection, logout, draft persistence, publish isolation, revision restore, and keyboard access.
- Public `/` must not contain editor controls or draft text.
- Editor controls must remain inside 390px mobile and desktop viewports.
- Existing room carousel swipe, mobile menu, multilingual, rates, and WhatsApp tests must continue to pass.

### Visual

- Capture `/`, `/admin`, an open text editor, and an open image editor at desktop and mobile widths.
- Inspect screenshots to confirm pencil anchors correspond to their content, do not obscure key text/images, and remain synchronized after responsive layout changes.
- Compare the public and editor canvases to confirm the underlying layout is identical.

## Boundaries

### Always

- Reuse the real page components for public and editor views.
- Validate every mutation on the server.
- Save drafts separately and require an explicit Publish action.
- Keep edit icons, content paths, overlays, and mobile positioning synchronized with future layout changes.
- Preserve the existing public design, behavior, languages, rates, WhatsApp routing, and responsive carousels.

### Ask first

- Adding more CMS users or roles.
- Changing the storage provider.
- Allowing layout, font, color, CSS, or arbitrary section changes.
- Deleting uploaded images or revision history.
- Changing the Google Sheet rates workflow.

### Never

- Commit plaintext passwords, password hashes, session secrets, or Blob tokens.
- Expose drafts or private storage to public visitors.
- Duplicate the website into a separately maintained admin layout.
- Allow content edits to inject scripts, HTML, or CSS.

## Success Criteria

- The configured `hhbedit` account can sign in with the supplied password and receives a secure server-verified session.
- Unauthenticated visitors cannot access `/admin` or any CMS mutation.
- Every approved content group has a clear, accessible pencil control positioned on the real page.
- Text and slideshow changes persist as drafts without changing `/`.
- Publishing updates `/` and creates a restorable revision.
- Uploaded images can be assigned, reordered, previewed, and published safely.
- All four languages can be edited without losing longer translated copy.
- The editor and public page have no horizontal overflow at tested mobile widths.
- Existing public-site tests, lint, and production build pass.
- No OpenAI API dependency or key is introduced.

## Open Questions for Approval

1. Approve Vercel Blob as the storage provider: one private store for content/revisions and one public store for website images.
2. Approve explicit draft and Publish controls rather than immediately changing the public page.
3. Approve the editable-content scope above while keeping rates and layout locked.
