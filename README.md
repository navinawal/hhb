# Holiday Home Bhaktapur

A four-language, single-page Next.js website for Holiday Home Bhaktapur. It includes room browsing, swipeable photo galleries, WhatsApp booking requests, an optional Google Sheet rate/availability connection, and a protected inline visual CMS.

## Run locally

```powershell
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the public map and booking-platform links before launch.

## Visual CMS

Open `http://localhost:3000/admin` and sign in with the configured CMS account. The editor renders the real website and places pencil buttons beside editable text, room details, images, contact information, and translations.

- **Apply changes** updates the on-screen draft only.
- **Save draft** stores changes privately; visitors still see the previously published page.
- **Preview** hides editor controls so the draft can be checked cleanly.
- **Publish** applies all current edits to the public website and creates a restorable revision.
- **History** restores an older published version as a draft. Restoring does not change the live page until Publish is pressed.

The local account variables are stored only in the ignored `.env.local` file. Never commit the password, its hash, the session secret, or Blob tokens.

### Vercel storage setup

Create two Blob stores from the Vercel project’s **Storage** tab:

1. A **Private** Blob store for draft content, published content, login rate limits, and revisions. Connect it with the `CMS_` prefix so Vercel creates `CMS_READ_WRITE_TOKEN`.
2. A **Public** Blob store for uploaded website photographs. Connect it with the `CMS_MEDIA_` prefix so Vercel creates `CMS_MEDIA_READ_WRITE_TOKEN`.

Add these variables to both Preview and Production as needed:

```text
CMS_USERNAME
CMS_PASSWORD_SALT
CMS_PASSWORD_HASH
CMS_SESSION_SECRET
CMS_READ_WRITE_TOKEN
CMS_MEDIA_READ_WRITE_TOKEN
```

Copy the first four secure values from the local `.env.local` into Vercel. Production CMS writes fail safely when storage is not configured; the public page continues using its built-in content.

## Google Sheet rates

Create a sheet with these exact column names:

| start_date | end_date | room_type | rate_npr | available_rooms |
| --- | --- | --- | ---: | ---: |
| 2026-08-01 | 2026-09-30 | standard | 3500 | 3 |
| 2026-08-01 | 2026-09-30 | kitchen | 5000 | 2 |

- Use ISO dates (`YYYY-MM-DD`).
- `room_type` must be `standard` or `kitchen`.
- Use `0` available rooms to mark a room type unavailable for the date range.
- Publish the tab as CSV, then place its CSV URL in `GOOGLE_SHEET_CSV_URL` inside `.env.local`.
- The site refreshes the published data every five minutes and shows the applicable nightly rate. Final totals remain confirmed through WhatsApp.

## Before launch

Set the real values for `NEXT_PUBLIC_BOOKING_URL`, `NEXT_PUBLIC_AIRBNB_URL`, `NEXT_PUBLIC_MAP_URL`, `NEXT_PUBLIC_SITE_URL`, and the NPR/USD guide in `.env.local`. Buttons for missing platform and map URLs remain hidden.

## Production holding page

Set `SITE_MODE=coming-soon` only in the Vercel **Production** environment. Production will show the branded holding page, while Preview deployments continue to show the complete website. Remove the variable and redeploy when the full site is ready to launch.
