# Holiday Home Bhaktapur

A bilingual, single-page Next.js website for Holiday Home Bhaktapur. It includes room browsing, a property gallery, WhatsApp booking requests, transport requests, and an optional Google Sheet rate/availability connection.

## Run locally

```powershell
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the public map and booking-platform links before launch.

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
