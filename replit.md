# MS Detailing Carbon

Premium auto detailing landing page + Telegram Mini App for a studio in Kazan, Russia.

## Stack

- **Backend**: Python 3 — standard library only (`http.server`). No external dependencies.
- **Frontend**: Vanilla HTML/CSS/JS (no build step). Two entry points:
  - `index.html` — public website
  - `tma.html` — Telegram Mini App (TMA)

## Running

```bash
python3 server.py
```

Serves on port 5000. Static files are served from the project root.

## Key files

| File | Purpose |
|------|---------|
| `server.py` | Static server + `/submit` endpoint (multipart form → Telegram Bot API) |
| `index.html` + `style.css` + `main.js` | Public landing page |
| `tma.html` + `tma.js` + `tma.css` | Telegram Mini App (12 screens, tab router) |
| `api/submit.py` | Form submission handler logic |
| `assets/` | Car photos and videos used by both apps |

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `SESSION_SECRET` | ✅ set | HMAC key for request correlation IDs |
| `TG_BOT_TOKEN` | ❌ missing | Telegram Bot API token (form submissions won't deliver without this) |
| `TG_CHAT_ID` | ❌ missing | Telegram chat ID to receive form submissions |

## TMA screens

Home · Services · Service Detail · Booking · Payment · Payment Processing · Booking Success · **Try-On** · Studio · Gallery · Reviews · About · Profile · Promo

## Try-On feature (v4)

Four-tab zone-aware visual customizer in `tma.js` (`renderTryOn`, lines ~808–920):

| Tab | What it shows |
|-----|--------------|
| **Кузов** | Original / Polish / Ceramic / PPF / Color Wrap — 12 film colors with finish names; `mix-blend-mode: hue` CSS overlay |
| **Тонировка** | 5 darkness levels (70%→5%); trapezoid clip-path overlay simulating window area |
| **Диски** | 7 wheel colors; circular overlays at heuristic wheel positions |
| **Салон** | Drag before/after slider (BMW demo images); upload own photo for filter simulation |

Users can load a demo G-Wagon image or upload their own car photo.

## User preferences

- Keep existing project structure and stack.
- Russian-language UI throughout.
