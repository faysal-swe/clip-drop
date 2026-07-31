# ClipDrop — Phase 1 (Home page)

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Axios.

## What's in Phase 1

- **Design tokens** — `app/globals.css` defines the full light/dark palette,
  radius scale, and shadow as CSS variables; `tailwind.config.ts` maps them
  into Tailwind's theme so every component uses `bg-accent`, `text-secondary`,
  `rounded-lg`, etc. instead of hardcoded values.
- **Logo** — `components/Logo.tsx`, a flat droplet + play-triangle mark
  ("clip" + "drop"), works at favicon size, single accent color.
- **Home page** — `app/page.tsx`, assembled from:
  - `Header` (logo, nav, theme toggle)
  - `HomeAnalyzer` (URL input, Paste/Analyze, and all four states: empty,
    loading, success, error)
  - `PlatformRow` (neutral monogram badges — not reproductions of any
    platform's actual logo)
  - `VideoResult` + `FormatList` (thumbnail, metadata, video/audio format
    rows with Download buttons)
  - `ProgressBar` (percent, speed, ETA, cancel)
  - `AdSlot` × 3 (top banner, in-content, footer — clearly labelled
    placeholders sized for standard IAB units)
  - `Footer`
- **No motion** — `globals.css` forces `transition: none` / `animation: none`
  globally; every state change is an instant swap, per the brief.
- **Light/dark mode** — toggle in the header, persisted to
  `localStorage`, with a no-flash inline script in `app/layout.tsx`.

## Important: the backend is a mock

`app/api/analyze/route.ts` returns **fake data only**, so the UI has
something real to render for every state. It does **not** extract or
download media from YouTube/TikTok/etc. — swap it for a call to your own
backend/service before shipping. `lib/api.ts` is the Axios client the
frontend already calls (`POST /api/analyze`), so pointing it at a real
backend is a one-line change (`baseURL`).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Try:
- Pasting any `https://youtube.com/...`-style URL → success state
- Leaving it empty and hitting Analyze → invalid URL error
- A URL containing the word `private` / `unavailable` / `timeout` /
  `copyright` → that specific error state
- The theme toggle (top right) → dark mode

## Not in this phase

History, Favorites, and Settings pages/modals, the Admin Dashboard, and
responsive breakpoints beyond the single desktop-first layout requested —
these are left for the next phase.
