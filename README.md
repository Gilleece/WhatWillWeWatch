# What Will We Watch

**A conversational movie recommender** — answer a few quick questions and get personalized suggestions with trailers, cast, and where to stream them.

[Live site](https://gilleece.github.io/WhatWillWeWatch/) | [GitHub](https://github.com/Gilleece/WhatWillWeWatch)

---

## Overview

What Will We Watch is a totally free, no ads, web app that recommends movies tailored to your mood, era preference, time available, and taste. Built on **The Movie Database (TMDB) API**, it combines a conversational guided search with an advanced filter panel — no typing required, just clicking.

The site is fully responsive across desktop and mobile.

---

## Features

### Conversational Guided Search
Start by tapping your way through five quick questions:
1. **What's the mood?** — Make me laugh, Scare me, Blow my mind, Heartfelt, Family night, Hidden gem vibes, Gritty & serious, True stories, Surprise me
2. **Which era?** — Brand new, 2010s/newer, 90s/00s throwback, Classics, Any era
3. **How much time?** — Short & sweet, Around two hours, Epics welcome
4. **What kind of pick?** — Crowd pleaser, Critically acclaimed, Hidden gem, Roll the dice (random page each tap)
5. **Where are you?** — Optional; saves your country for streaming availability

No text input — pure click-and-discover.

### Advanced Search
Power users can toggle a sleek slide-in drawer for fine-grained control:
- **Genres** — Include or exclude up to 19 genres; match any or all
- **Release years** — Dual-range slider (1900–today)
- **Minimum score** — IMDb-style 0–9 slider
- **Vote thresholds** — Any, 50+, 250+, 1000+ votes
- **Runtime** — Short (<90 min), mid (90–120), extended (120–150), epic (150+)
- **Age rating** — US certifications (G, PG, PG-13, R, NC-17)
- **Original language** — English, French, Spanish, etc.
- **Streaming services** — Filter by Netflix, Prime, etc. (loads per region)
- **Starring / Directed by** — Live TMDB person search
- **Sort by** — Popularity, score, release date, box office

Results render as a modern card grid with poster images, ratings, and skip/pagination.

### Movie Details
Click any poster to open a rich modal with:
- Backdrop hero + playable trailer (in-place YouTube embed)
- Title, tagline, year, runtime, age rating, IMDb score
- Full cast strip (horizontally scrollable)
- Plot summary
- **Where to watch** — Streaming, rental, and buy options with provider logos + JustWatch link
- Genre pills and director credit

### Persistent Settings
- **Remembered country** — Once chosen, it's remembered for next visit (no default bias toward any region)
- **Dark mode** — Always on; respects system preference
- **Reduced motion** — Skips animations if your OS requests it

---

## How It Works

1. **Visit the site** → See the intro animation ("WWWW" → "What Will We Watch?")
2. **Tap your way through the chat** → Each answer filters the TMDB discover endpoint
3. **Get results** → A grid of up to 20 movies matching your vibe, with counts
4. **Explore** → Click a poster for full details, trailers, cast, and streaming info
5. **Refine** → "Start over" to retake the quiz, or toggle "Advanced search" to tweak filters
6. **Load more** → Pagination to see more results, or reroll if you picked "Roll the dice"

---

## Tech Stack

- **Frontend:** Vanilla ES2020+ (no frameworks)
- **Styling:** Pure CSS3 (custom properties, grid, backdrop blur, smooth animations)
- **API:** TMDB API (discover, detail, videos, credits, watch providers, people search)
- **Deployment:** GitHub Pages (static; no build step)
- **Browser support:** Modern browsers (Edge, Chrome, Firefox, Safari on iOS 14+)

---

## Project History

**Original (2019):** Built as a Code Institute milestone project with jQuery, Bootstrap, and a form-based search UI.

**Redesign (2026):** Completely rebuilt with modern vanilla JS, a conversational chat-first UX, and a contemporary dark theme with gradient accents. The core product idea (mood-based discovery + streaming availability) remains unchanged; the execution is new.

---

## Getting Started

### View Live
Visit [gilleece.github.io/WhatWillWeWatch](https://gilleece.github.io/WhatWillWeWatch/) — no setup needed.

### Run Locally
```bash
# Clone the repo
git clone https://github.com/Gilleece/WhatWillWeWatch.git
cd WhatWillWeWatch

# Serve on localhost (Python 3)
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

### API Key
The TMDB API key is embedded in the code (it's a free, public API and poses no security risk). If you fork it, [get your own key](https://www.themoviedb.org/settings/api) and replace it in `assets/js/data.js`.

---

## File Structure

```
.
├── index.html                    # Main markup
├── assets/
│   ├── css/
│   │   └── style.css             # All styling (no external CSS)
│   ├── js/
│   │   ├── data.js               # Config, genre/country/language data
│   │   ├── api.js                # TMDB API wrapper (fetch/async)
│   │   ├── results.js            # Search grid, pagination, detail modal
│   │   ├── chat.js               # Conversational guided flow
│   │   ├── advanced.js           # Advanced search drawer logic
│   │   └── main.js               # Boot sequence & intro animation
│   └── images/
│       └── tmdblogo.svg          # TMDB attribution logo
└── README.md
```

---

## Credits

- **TMDB API** — Movie data, imagery, and streaming provider info
- **JustWatch** — Streaming availability details
- **Google Fonts** — Outfit typeface
- **Playwright** — Browser automation (testing only, not in production)

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license. You are free to use, modify, and share this work for non-commercial purposes.

---

## Questions? Ideas?

Contact: [info@whatwillwewatch.com](mailto:info@whatwillwewatch.com)
