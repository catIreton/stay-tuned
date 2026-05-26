# 📺 Tuned In — Retro TV Show Tracker

A retro CRT-aesthetic TV show tracker that lets you search, add, and track your favorite shows — including upcoming episode dates pulled live from the TVmaze API.

**Live Demo:** [yourusername.github.io/tuned-in](https://yourusername.github.io/tuned-in)

---

## Features

- **Live show search** powered by the [TVmaze API](https://www.tvmaze.com/api) — no API key required
- **Next episode tracking** with urgency cues (airing today, airing in X days, date TBD, series ended)
- **Airing soon banner** highlights anything dropping in the next 3 days
- **Status management** — categorize shows as Watching, Waiting, or Dropped
- **Refresh button** per show to re-fetch the latest episode data
- **Persistent storage** via localStorage — your list survives page reloads
- **Retro CRT aesthetic** — scanline overlay, phosphor green palette, VT323 monospace font

---

## Screenshots

> _Add screenshots here once deployed_

---

## Tech Stack

- Vanilla HTML, CSS, JavaScript — no frameworks, no build step
- [TVmaze REST API](https://www.tvmaze.com/api) for show data
- Google Fonts (VT323)
- Tabler Icons

---

## Getting Started

### Run locally

Just open `index.html` in your browser — no server or dependencies needed.

```bash
git clone https://github.com/catireton/tuned-in.git
cd tuned-in
open index.html
```

### Deploy to GitHub Pages

1. Push the repo to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select your main branch and `/ (root)`
4. Your site will be live at `https://catireton.github.io/tuned-in`

---

## Roadmap

- [ ] Episode-level checklist (mark individual eps watched)
- [ ] Personal ratings and notes per show
- [ ] Sort and filter options (by next air date, network, status)
- [ ] Export / import list as JSON
- [ ] Backend + user accounts for cross-device sync

---

## API

This project uses the free [TVmaze API](https://www.tvmaze.com/api). No authentication or API key is required. Endpoints used:

- `GET /search/shows?q={query}` — search shows by name
- `GET /shows/{id}?embed=nextepisode` — get show details + next episode
- `GET /shows/{id}/episodes` — get full episode list (used for season count)

---

## License

MIT