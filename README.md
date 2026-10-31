# 🌤️ SkyPulse — Live Weather & Climate Analytics Dashboard

> **Real-time weather intelligence, wrapped in a modern Liquid Glass UI.**
> Built for the IBM Global AI Builders Challenge · Capstone Project

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/Open--Meteo-API-38BDF8?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-4ADE80?style=flat-square)
![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-A78BFA?style=flat-square)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack & Constraints](#-tech-stack--constraints)
- [Screenshots](#-screenshots)
- [How to Run Locally](#-how-to-run-locally)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [License & Credits](#-license--credits)

---

## 🌍 Project Overview

### What is SkyPulse?

**SkyPulse** is a fully client-side, real-time weather and climate analytics dashboard that delivers live atmospheric data for any city in the world. It combines a polished **Liquid Glassmorphism UI** with a dynamic background that shifts tone and colour based on the current weather condition — warm golden-amber for sunny skies, deep indigo for storms, cosmic purple for night.

No servers. No build tools. No dependencies. Just open `index.html` in a browser.

### Problem Statement

Most weather applications are either bloated with heavyweight frameworks that slow them down, or visually bland and hard to read at a glance. Users who want immediate, accurate weather data — without signing up for an API key or installing anything — are underserved.

SkyPulse solves this by shipping a **zero-dependency, single-page dashboard** that fetches live data from the free Open-Meteo API and presents it through a visually rich, fully responsive interface that works on any device, in any modern browser, instantly.

### Target Users

| User | Need |
|---|---|
| **Everyday commuters** | Quick glance at current conditions, rain probability, and UV index before heading out |
| **Travellers & planners** | 7-day forecast and city search for destinations worldwide |
| **Developers & students** | A clean reference implementation of vanilla ES6+, REST API integration, and CSS advanced techniques |
| **IBM AI Builders Challenge participants** | A demonstration of AI-assisted, production-quality frontend engineering |

---

## ✨ Key Features

### 🌐 Real-Time Weather Data via Open-Meteo API
Fetches live atmospheric measurements on every city search — no API key required. Data includes current temperature, apparent (feels-like) temperature, relative humidity, wind speed, precipitation probability, surface pressure, UV index, and visibility.

### 🔍 Geocoding City Search with Auto-Suggestions
A debounced (320 ms) search bar queries the **Open-Meteo Geocoding API** as you type, returning up to 6 city suggestions with country/region context in a keyboard-navigable dropdown. Supports `Enter`, `ArrowDown`, and `Escape` keyboard shortcuts for full accessibility.

### 🎨 Dynamic Weather-Adaptive Background
The full-page background gradient morphs in real time based on the live WMO weather condition code:

| Condition | Visual Tone |
|---|---|
| ☀️ Clear / Sunny | Warm golden-amber crown + deep sapphire base |
| 🌧️ Rainy / Drizzle | Cool indigo-slate burst + oceanic dark blue |
| ⛈️ Thunderstorm | Deep oceanic indigo + near-black base |
| ☁️ Cloudy / Overcast | Soft neutral dark-grey + deep teal atmospheric glow |
| ❄️ Snow | Pale arctic blue glimmer + icy navy base |
| 🌙 Night | Deep midnight blue + cosmic purple ambient hue |

Night-time is detected automatically from the city's local timezone (returned by Open-Meteo), overriding the clear/cloudy theme between 19:00 and 06:00 local time.

### 💎 Liquid Glass Aesthetic (Glassmorphism 2.0)
Cards use a multi-layered **Liquid Glass** rendering technique:
- `backdrop-filter: blur(18px–24px) saturate(180–200%) brightness(1.06–1.08)`
- Semi-transparent 3-stop diagonal gradient fill
- `1px solid rgba(255,255,255,0.15–0.18)` frosted border
- 4-layer `box-shadow`: inset full-perimeter hairline + inset top-rim highlight + outer drop + outer depth
- `::after` pseudo-element top-gloss streak (simulates surface light reflection)
- Per-condition ambient glow driven by `--theme-tint` CSS custom properties injected by JavaScript

### 📅 7-Day Forecast Grid
A responsive grid showing the next 7 days with the day label, a custom inline SVG weather icon, and daily high/low temperatures. The current day is visually highlighted. The grid reflows gracefully at tablet (4 columns) and mobile (2 columns) breakpoints.

### 📊 4 Key KPI Metric Cards
At-a-glance metrics displayed below the hero card:

| Card | Metric | Source |
|---|---|---|
| 💨 Wind Speed | Current km/h | `current.wind_speed_10m` |
| ☀️ UV Index | Daily maximum + pressure hPa | `daily.uv_index_max` + `current.surface_pressure` |
| 🌧️ Precipitation | Probability % | `current.precipitation_probability` |
| 👁️ Visibility | km | `current.visibility` |

### 🌡️ °C / °F Temperature Unit Toggle
A pill-style toggle in the navigation bar instantly re-renders all temperature values (hero card, feels-like, and all 7 forecast cards) without triggering a new API fetch. State is preserved in memory.

### ⏳ UX Loading & Error States
- **Loading**: A spinning `border-top` CSS spinner with a descriptive `aria-live` region
- **Error**: A styled `role="alert"` error banner with an inline SVG icon, shown for both network failures and unrecognised city searches

---

## 🛠️ Tech Stack & Constraints

### Built With

| Layer | Technology |
|---|---|
| Markup | **HTML5** — Semantic elements (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`) |
| Styling | **CSS3** — Custom Properties, Flexbox, CSS Grid, `backdrop-filter`, `@keyframes`, `clamp()` |
| Logic | **Vanilla JavaScript ES6+** — `async/await`, `fetch`, `URLSearchParams`, `const`/`let`, arrow functions, template literals, `DocumentFragment` |
| Data | **Open-Meteo REST API** — Free, no API key, no rate limits for reasonable usage |

### Strict Constraints (Competition Rules)

> ✅ **Zero** external JavaScript frameworks (no React, Vue, Svelte, Angular)  
> ✅ **Zero** CSS frameworks or utility libraries (no Tailwind, Bootstrap, Bulma)  
> ✅ **Zero** icon libraries (no Font Awesome, Heroicons — all icons are hand-authored inline SVGs)  
> ✅ **Zero** build tools required (no Webpack, Vite, npm — open directly in a browser)  
> ✅ **Zero** API keys needed (Open-Meteo is completely free and open)

### Accessibility (WCAG AA)

- All interactive elements carry `aria-label` attributes
- The search input uses `aria-autocomplete`, `aria-controls`, and `aria-expanded`
- Forecast cards carry `aria-label` with full spoken condition text
- Unit toggle buttons use `aria-pressed` to convey state to screen readers
- All text-on-background colour pairings meet 4.5:1 contrast ratio against `#0F172A`
- Full keyboard navigation throughout (`Tab`, `Enter`, `ArrowDown`, `Escape`)
- `:focus-visible` ring on all interactive elements

---

## 📸 Screenshots

> Open `index.html` in your browser to see the live dashboard.

**Default view — Jakarta, Clear Sky (daytime)**
- Hero card displays golden-amber liquid glass glow
- Background shows warm amber crown gradient

**Rainy city search result**
- Background shifts to deep indigo-slate
- KPI cards show precipitation probability highlighted

**Night-time detection**
- Automatically applies cosmic purple ambient theme
- No manual toggle needed — timezone is resolved from the API response

---

## 🚀 How to Run Locally

SkyPulse requires **no installation, no terminal, no build step**. It runs entirely in the browser.

### Option A — Direct File Open (Simplest)

```
1. Download or clone this repository
2. Open the project folder
3. Double-click index.html
   → It opens directly in your default web browser
```

### Option B — Clone via Git

```bash
# 1. Clone the repository
git clone https://github.com/StarScream256/weather-forecast-ibm-capstone.git

# 2. Enter the project directory
cd skypulse-weather-dashboard

# 3. Open index.html in your browser
#    macOS
open index.html

#    Windows
start index.html

#    Linux
xdg-open index.html
```

### Option C — Local Dev Server (Optional, for stricter CORS environments)

If your browser blocks `file://` fetch requests, serve the files with any static server:

```bash
# Python 3 (no install needed on most systems)
python -m http.server 8080
# Then visit: http://localhost:8080

# Node.js (if available)
npx serve .
# Then visit: http://localhost:3000
```

### Browser Compatibility

| Browser | Support |
|---|---|
| Chrome / Edge 88+ | ✅ Full (`backdrop-filter` supported) |
| Firefox 103+ | ✅ Full |
| Safari 15.4+ | ✅ Full (`-webkit-backdrop-filter` prefixed) |
| Opera 74+ | ✅ Full |

> **Note:** `backdrop-filter` degrades gracefully in older browsers — cards remain fully readable with their semi-transparent background fill; only the blur effect is absent.

---

## 📁 Project Structure

```
skypulse-weather-dashboard/
│
├── index.html          # Semantic HTML5 shell
│   │                   # All layout landmarks, ARIA roles, and DOM targets
│   │                   # Links style.css in <head>, app.js before </body>
│   │
│   ├── <header>        # Sticky nav: brand, search field, °C/°F toggle
│   ├── <main>          # Loading overlay, error banner, hero card,
│   │                   # KPI grid, 7-day forecast section
│   └── <footer>        # Attribution + copyright
│
├── style.css           # All visual styling — zero external dependencies
│   │
│   ├── :root           # Design token custom properties (spacing, radii,
│   │                   # transitions, default --theme-tint variables)
│   ├── .theme-*        # 6 multi-layer background-image gradient themes
│   │                   # (clear, rainy, stormy, cloudy, snowy, night)
│   ├── .glass-card     # Liquid Glass base: blur, gradient fill, box-shadow,
│   │                   # ::after gloss pseudo-element
│   ├── .hero-card      # Enhanced liquid glass (blur 24px, tint corner wash)
│   ├── .kpi-card       # Medium liquid glass (blur 20px, tint hover glow)
│   ├── .forecast-card  # Lightweight frosted forecast tile
│   └── @media          # Responsive breakpoints: 900px, 640px, 420px
│
└── app.js              # All application logic — zero external dependencies
    │
    ├── Constants        # API endpoints, DEFAULT_LOCATION, WMO_CODES map,
    │                    # DAYS array, THEME_TINTS palette
    ├── Icons{}          # 14 inline SVG generator functions (sun, rain,
    │                    # thunder, snow, fog, wind, uv, eye, heroArt…)
    ├── state{}          # Single source of truth: unit, city, lat, lon, data
    ├── dom{}            # All 27 element references, queried once at startup
    ├── Utilities        # toF(), fmtTemp(), getWmo(), setLoading(), showError()
    ├── API calls        # fetchSuggestions(), fetchForecast()
    ├── Render           # applyTheme() + THEME_TINTS, isNightTime(),
    │                    # renderHero(), renderKPI(), renderForecast(),
    │                    # rerenderTemps()
    ├── Orchestrator     # loadWeather() — async fetch + full render pipeline
    ├── Search/AC        # Debounced input handler, showSuggestions(),
    │                    # closeSuggestions(), keyboard nav, outside-click
    ├── Unit toggle      # °C / °F button handlers + aria-pressed state
    └── Bootstrap        # loadWeather(DEFAULT_LOCATION) on first render
```

---

## 🔌 API Reference

SkyPulse uses two endpoints from the **Open-Meteo** suite. Both are free, open, and require no API key or account registration.

### Geocoding API

```
GET https://geocoding-api.open-meteo.com/v1/search
    ?name={city}
    &count=6
    &language=en
    &format=json
```

Returns an array of matching places with `name`, `latitude`, `longitude`, `admin1` (region), and `country`.

### Forecast API

```
GET https://api.open-meteo.com/v1/forecast
    ?latitude={lat}
    &longitude={lon}
    &current=temperature_2m,apparent_temperature,relative_humidity_2m,
             weather_code,wind_speed_10m,precipitation_probability,
             surface_pressure,visibility
    &daily=weather_code,temperature_2m_max,temperature_2m_min,
           precipitation_probability_max,uv_index_max
    &wind_speed_unit=kmh
    &timezone=auto
    &forecast_days=7
```

Returns `current` measurements and a 7-day `daily` forecast. The `timezone` field in the response is used for automatic night-time detection.

**WMO Weather Interpretation Codes** — Full mapping defined in `app.js` → `WMO_CODES` constant. Reference: [open-meteo.com/en/docs#weathervariables](https://open-meteo.com/en/docs#weathervariables)

---

## 📄 License & Credits

### License

This project is released under the **MIT License**.  
You are free to use, copy, modify, and distribute it with attribution.

```
MIT License — Copyright (c) 2026 SkyPulse Contributors
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to deal in the Software without restriction, including the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
```

### Credits & Attribution

| Resource | Role | Link |
|---|---|---|
| **IBM Skillsbuild University Education × Hacktiv8** | Official program — IT: AI Agent for Programming | [IBM SkillsBuild](https://skillsbuild.org) |
| **IBM Bob** | AI Agent tool used during development | [IBM Bob](https://skillsbuild.org) |
| **Open-Meteo** | Weather forecast & geocoding data (free, open, no API key) | [open-meteo.com](https://open-meteo.com) |
| **WMO Weather Codes** | Weather condition interpretation standard | [WMO Code Table 4677](https://open-meteo.com/en/docs#weathervariables) |

### Built For

> 🏆 **IBM Skillsbuild University Education × Hacktiv8**

> **Program:** IT — AI Agent for Programming
> **AI Agent Tool:** IBM Bob
> **Weather Data API:** Open-Meteo API
> *Demonstrating production-quality frontend engineering with AI-assisted development.*
> Category: Web Application · Stack: HTML5 / CSS3 / Vanilla JS (ES6+)

---

<div align="center">

Made with ❤️ and ☁️ · Powered by [Open-Meteo](https://open-meteo.com)

</div>
