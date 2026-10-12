# Amhi Marathi Association — Website

Official website of the **Amhi Marathi Association** (आम्ही मराठी असोसिएशन),
the Marathi cultural club at VIT-AP University, Amaravati.

Live: https://kunal4060.github.io/amhi-marathi/

## What's inside

- **Hero** — "आम्ही मराठी" with a Maharashtra-silhouette backdrop and toran divider
- **About** — the club story, three pillars (उत्सव · भाषा · कुटुंब), real numbers, Warli art band
- **Interactive district map** — all 36 Maharashtra districts (official 2026 names);
  hover/tap a district to see its VIT-AP student count (saffron choropleth)
- **Events** — Ganeshotsav 2026 plus upcoming celebrations
- **Gallery** — moments (photos via Instagram for now)
- **Core team 2026–27** — real names and roles
- **Join** — Instagram + LinkedIn

## Design

"Festival poster meets editorial broadsheet": ivory paper ground, kesari `#E8720C`,
deep maroon `#6E1D1D`, zari gold hairlines. Type: Yatra One + Mukta (Google Fonts).
Warli and Paithani motifs used sparingly and respectfully. Dependency-free —
plain HTML/CSS/JS, no build step, hosted on GitHub Pages.

## Data notes

- Map boundaries: geoBoundaries gbOpen ADM2 (2021, LGD India), © Open Database
  Licence (ODbL) 1.0. Attribution is kept in the site footer.
- `assets/js/districts.js` — generated SVG paths (viewBox 0 0 800 660). Do not hand-edit;
  regenerate from the geoBoundaries source if boundaries change.
- `assets/js/data.js` — per-district student counts are currently **SAMPLE /
  PLACEHOLDER data**, clearly labelled on the site. Replace with real counts
  when available; missing districts render as 0.
