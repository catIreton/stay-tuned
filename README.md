# Stay Tuned — Retro TV Show Tracker

A retro CRT-aesthetic TV show tracker built with Next.js, TypeScript, TanStack Query, and Zustand. Search, track, and stay ahead of your shows — with live episode data from the TVmaze API.

**Live Demo:** [yourusername.github.io/stay-tuned](https://yourusername.github.io/stay-tuned)

---

## Features

- **Live show search** powered by the [TVmaze API](https://www.tvmaze.com/api) — no API key required
- **Next episode tracking** with urgency cues (airing today, airing in X days, date TBD, series ended)
- **Airing soon banner** highlights anything dropping in the next 3 days
- **Status management** — categorize shows as Watching, Waiting, or Dropped
- **Rating & notes** — star rating and freeform notes per show
- **Sort options** — by date added, next air date, network, or status
- **Export / import** — save and restore your list as JSON
- **Calendar reminders** — add next-episode events to Google, Apple, Outlook, or email
- **Bulk refresh** to re-fetch all shows at once
- **Persistent storage** via Zustand + localStorage — your list survives page reloads
- **Retro CRT aesthetic** — scanline overlay, phosphor green palette, VT323 monospace font
- **PWA-ready** — installable on mobile via the browser's "Add to Home Screen"

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| State management | Zustand v5 with `persist` middleware |
| API | [TVmaze REST API](https://www.tvmaze.com/api) |
| Fonts | Google Fonts — VT323 (via `next/font`) |
| Testing | Vitest + Testing Library |
| CI/CD | GitHub Actions → GitHub Pages |
| Mobile | PWA manifest + viewport meta |

---

## Getting Started

```bash
git clone https://github.com/catireton/stay-tuned.git
cd stay-tuned
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
npm test           # run all unit tests (watch mode)
npm test -- --run  # run once and exit (CI mode)
npm run build      # verify static export
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout — fonts, metadata, providers
│   ├── page.tsx              # Home page
│   └── globals.css           # Tailwind v4 + CRT theme tokens + custom effects
├── components/
│   ├── ShowTracker.tsx       # Main shell — search state, keyboard nav, layout
│   ├── SearchBar.tsx         # Debounced search input with keyboard nav
│   ├── SearchResults.tsx     # TVmaze results dropdown
│   ├── ShowList.tsx          # Filtered + sorted list of tracked shows
│   ├── ShowCard.tsx          # Individual show card — rating, notes, reminders
│   ├── ToolBar.tsx           # Sort, bulk refresh, export, import
│   ├── FilterTabs.tsx        # ALL / WATCHING / WAITING / DROPPED tabs
│   ├── AiringSoonBanner.tsx
│   ├── StatusBar.tsx         # Count summary + status message
│   └── Providers.tsx         # QueryClientProvider wrapper
├── hooks/
│   ├── useSearchShows.ts     # TanStack Query — TVmaze search
│   └── useAddShow.ts         # TanStack Mutation — fetch + add to store
├── lib/
│   ├── tvmaze.ts             # TVmaze API fetch functions
│   ├── format.ts             # Date formatting + timeAgo utilities
│   ├── calendar.ts           # Calendar URL builders + .ics generator
│   └── export.ts             # JSON export / import helpers
├── store/
│   └── showStore.ts          # Zustand store with localStorage persistence
└── types/
    └── tvmaze.ts             # TypeScript interfaces for API + store
```

---

## Roadmap

### Phase 1 — Foundation Rebuild

Migrating from a vanilla HTML prototype to a production-grade stack:

- [x] Next.js 16 App Router with TypeScript
- [x] Tailwind CSS v4 with custom CRT color tokens
- [x] TanStack Query v5 for TVmaze API fetching and caching
- [x] Zustand v5 with `persist` middleware (replaces raw localStorage)
- [x] Component-based architecture with clear separation of concerns
- [x] PWA manifest for mobile "Add to Home Screen" support
- [x] Responsive layout (mobile-first, centered on desktop)
- [x] `next/font` for optimized font loading (VT323)
- [x] Deploy to GitHub Pages (static export via `next export`)
- [x] CI via GitHub Actions (build + deploy on push to main)
- [ ] Add PWA icons (192px + 512px)

### Phase 2 — Enhanced UX

Features that improve usability without requiring a backend:

- [ ] Episode-level checklist — mark individual episodes as watched
- [x] Personal rating (1–5 stars) and notes per show
- [x] Sort options — by next air date, date added, network, status
- [x] Export / import show list as JSON
- [x] Click-outside to dismiss search results
- [x] Keyboard navigation for search result list (↑ ↓ Enter Escape)
- [x] Stale data indicator — show when episode data was last refreshed
- [x] Bulk refresh button to re-fetch all shows at once
- [x] Calendar reminders — Google, Apple (.ics), Outlook, mailto
- [ ] Service worker for basic offline support (`next-pwa` or Workbox)

### Phase 3 — Backend & Cross-Device

Harder lifts that require infrastructure:

- [ ] **Supabase backend** — PostgreSQL for show lists, episode progress, ratings
- [ ] **Supabase Auth** — email/password and OAuth (Google, GitHub)
- [ ] **Cross-device sync** — list lives in the cloud, persists across browsers/devices
- [ ] **Optimistic updates** — local state updates instantly, syncs in background
- [ ] **Row-level security** — each user only sees their own data
- [ ] **Push notifications** (Web Push API) — alert when a new episode drops
- [ ] **React Native / Expo companion** — share business logic in a monorepo, native iOS/Android app
- [ ] **TMDB API integration** — richer metadata (trailers, cast, genre tags, ratings)
- [ ] **Show recommendations** — suggest similar shows based on watch history

---

## API

This project uses the free [TVmaze API](https://www.tvmaze.com/api). No authentication required.

| Endpoint | Used for |
|---|---|
| `GET /search/shows?q={query}` | Search shows by name |
| `GET /shows/{id}?embed=nextepisode` | Show details + next episode |
| `GET /shows/{id}/episodes` | Full episode list (season count) |

---

## License

MIT
