/**
 * ═══════════════════════════════════════════════════════════════════
 * SkyPulse — app.js
 * Live Weather & Climate Analytics Dashboard
 * Vanilla ES6+ · Open-Meteo API · Zero dependencies
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS & CONFIG
───────────────────────────────────────────────────────────────── */

const API = {
  GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
  FORECAST:  'https://api.open-meteo.com/v1/forecast',
};

/** Default city loaded on first render */
const DEFAULT_LOCATION = { name: 'Jakarta', lat: -6.2088, lon: 106.8456 };

/**
 * WMO Weather Interpretation Codes → { label, theme, svgKey }
 * https://open-meteo.com/en/docs#weathervariables
 */
const WMO_CODES = {
  0:  { label: 'Clear Sky',          theme: 'clear',  svgKey: 'sun'         },
  1:  { label: 'Mainly Clear',       theme: 'clear',  svgKey: 'sun'         },
  2:  { label: 'Partly Cloudy',      theme: 'cloudy', svgKey: 'partcloud'   },
  3:  { label: 'Overcast',           theme: 'cloudy', svgKey: 'cloud'       },
  45: { label: 'Foggy',              theme: 'cloudy', svgKey: 'fog'         },
  48: { label: 'Icy Fog',            theme: 'cloudy', svgKey: 'fog'         },
  51: { label: 'Light Drizzle',      theme: 'rainy',  svgKey: 'drizzle'     },
  53: { label: 'Drizzle',            theme: 'rainy',  svgKey: 'drizzle'     },
  55: { label: 'Heavy Drizzle',      theme: 'rainy',  svgKey: 'drizzle'     },
  61: { label: 'Light Rain',         theme: 'rainy',  svgKey: 'rain'        },
  63: { label: 'Rain',               theme: 'rainy',  svgKey: 'rain'        },
  65: { label: 'Heavy Rain',         theme: 'rainy',  svgKey: 'rain'        },
  71: { label: 'Light Snow',         theme: 'snowy',  svgKey: 'snow'        },
  73: { label: 'Snow',               theme: 'snowy',  svgKey: 'snow'        },
  75: { label: 'Heavy Snow',         theme: 'snowy',  svgKey: 'snow'        },
  77: { label: 'Snow Grains',        theme: 'snowy',  svgKey: 'snow'        },
  80: { label: 'Light Showers',      theme: 'rainy',  svgKey: 'shower'      },
  81: { label: 'Showers',            theme: 'rainy',  svgKey: 'shower'      },
  82: { label: 'Violent Showers',    theme: 'stormy', svgKey: 'shower'      },
  85: { label: 'Snow Showers',       theme: 'snowy',  svgKey: 'snow'        },
  86: { label: 'Heavy Snow Showers', theme: 'snowy',  svgKey: 'snow'        },
  95: { label: 'Thunderstorm',       theme: 'stormy', svgKey: 'thunder'     },
  96: { label: 'Thunderstorm & Hail',theme: 'stormy', svgKey: 'thunder'     },
  99: { label: 'Thunderstorm & Hail',theme: 'stormy', svgKey: 'thunder'     },
};

/** Day-of-week short labels */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ─────────────────────────────────────────────────────────────────
   SVG ICON LIBRARY  (inline, no external font/icon sets)
   Each function returns an SVG string.
───────────────────────────────────────────────────────────────── */

const Icons = {
  /** Bright sun */
  sun: (color = '#FCD34D') => `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="13" fill="${color}" opacity="0.9"/>
      <g stroke="${color}" stroke-width="3" stroke-linecap="round">
        <line x1="32" y1="6"  x2="32" y2="14"/>
        <line x1="32" y1="50" x2="32" y2="58"/>
        <line x1="6"  y1="32" x2="14" y2="32"/>
        <line x1="50" y1="32" x2="58" y2="32"/>
        <line x1="14.7" y1="14.7" x2="20.5" y2="20.5"/>
        <line x1="43.5" y1="43.5" x2="49.3" y2="49.3"/>
        <line x1="49.3" y1="14.7" x2="43.5" y2="20.5"/>
        <line x1="20.5" y1="43.5" x2="14.7" y2="49.3"/>
      </g>
    </svg>`,

  /** Partly cloudy (sun + cloud) */
  partcloud: () => `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="22" r="10" fill="#FCD34D" opacity="0.85"/>
      <g stroke="#FCD34D" stroke-width="2.2" stroke-linecap="round">
        <line x1="24" y1="6"  x2="24" y2="11"/>
        <line x1="24" y1="33" x2="24" y2="38"/>
        <line x1="6"  y1="22" x2="11" y2="22"/>
        <line x1="37" y1="22" x2="42" y2="22"/>
        <line x1="10.5" y1="8.5" x2="14.3" y2="12.3"/>
        <line x1="33.7" y1="31.7" x2="37.5" y2="35.5"/>
        <line x1="37.5" y1="8.5" x2="33.7" y2="12.3"/>
        <line x1="14.3" y1="31.7" x2="10.5" y2="35.5"/>
      </g>
      <rect x="20" y="32" width="34" height="18" rx="9" fill="#94A3B8" opacity="0.85"/>
      <ellipse cx="35" cy="31" rx="10" ry="9" fill="#94A3B8" opacity="0.9"/>
    </svg>`,

  /** Plain cloud */
  cloud: () => `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="30" width="44" height="22" rx="11" fill="#64748B"/>
      <ellipse cx="28" cy="29" rx="14" ry="13" fill="#64748B"/>
      <ellipse cx="42" cy="32" rx="10" ry="9" fill="#64748B"/>
    </svg>`,

  /** Fog / mist lines */
  fog: () => `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="18" width="44" height="14" rx="7" fill="#64748B" opacity="0.7"/>
      <ellipse cx="26" cy="17" rx="12" ry="10" fill="#64748B" opacity="0.7"/>
      <g stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" opacity="0.6">
        <line x1="10" y1="40" x2="54" y2="40"/>
        <line x1="14" y1="48" x2="50" y2="48"/>
        <line x1="18" y1="56" x2="46" y2="56"/>
      </g>
    </svg>`,

  /** Drizzle */
  drizzle: () => `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="10" width="44" height="22" rx="11" fill="#475569"/>
      <ellipse cx="28" cy="9" rx="14" ry="12" fill="#475569"/>
      <g stroke="#7DD3FC" stroke-width="2.2" stroke-linecap="round" opacity="0.9">
        <line x1="22" y1="40" x2="20" y2="50"/>
        <line x1="32" y1="40" x2="30" y2="50"/>
        <line x1="42" y1="40" x2="40" y2="50"/>
      </g>
    </svg>`,

  /** Rain */
  rain: () => `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="8" width="46" height="22" rx="11" fill="#334155"/>
      <ellipse cx="28" cy="8" rx="15" ry="13" fill="#334155"/>
      <g stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" opacity="0.9">
        <line x1="18" y1="38" x2="14" y2="54"/>
        <line x1="30" y1="38" x2="26" y2="54"/>
        <line x1="42" y1="38" x2="38" y2="54"/>
        <line x1="24" y1="44" x2="20" y2="58"/>
        <line x1="36" y1="44" x2="32" y2="58"/>
      </g>
    </svg>`,

  /** Shower */
  shower: () => `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="6" width="46" height="22" rx="11" fill="#334155"/>
      <ellipse cx="28" cy="6" rx="15" ry="13" fill="#334155"/>
      <g stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" opacity="0.85">
        <line x1="20" y1="36" x2="16" y2="48"/>
        <line x1="32" y1="36" x2="28" y2="48"/>
        <line x1="44" y1="36" x2="40" y2="48"/>
      </g>
      <g stroke="#7DD3FC" stroke-width="2" stroke-linecap="round" opacity="0.6">
        <line x1="14" y1="50" x2="10" y2="62"/>
        <line x1="26" y1="50" x2="22" y2="62"/>
        <line x1="38" y1="50" x2="34" y2="62"/>
      </g>
    </svg>`,

  /** Snow */
  snow: () => `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="6" width="46" height="22" rx="11" fill="#334155"/>
      <ellipse cx="28" cy="6" rx="15" ry="13" fill="#334155"/>
      <g stroke="#BAE6FD" stroke-width="2.5" stroke-linecap="round" opacity="0.9">
        <line x1="20" y1="38" x2="20" y2="54"/>
        <line x1="32" y1="38" x2="32" y2="54"/>
        <line x1="44" y1="38" x2="44" y2="54"/>
        <line x1="16" y1="42" x2="24" y2="42"/><line x1="16" y1="50" x2="24" y2="50"/>
        <line x1="28" y1="42" x2="36" y2="42"/><line x1="28" y1="50" x2="36" y2="50"/>
        <line x1="40" y1="42" x2="48" y2="42"/><line x1="40" y1="50" x2="48" y2="50"/>
      </g>
    </svg>`,

  /** Thunderstorm */
  thunder: () => `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="6" width="48" height="24" rx="12" fill="#1E293B"/>
      <ellipse cx="28" cy="6" rx="16" ry="13" fill="#1E293B"/>
      <polygon points="34,32 26,46 31,46 24,62 40,42 34,42" fill="#FBBF24" opacity="0.95"/>
    </svg>`,

  /* ── KPI icons ── */
  wind: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
    </svg>`,

  uv: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41
               M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>`,

  precip: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2L5 12a7 7 0 1 0 14 0Z"/>
    </svg>`,

  eye: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`,

  /** Large decorative hero art per theme — returns SVG string */
  heroArt: (theme) => {
    switch (theme) {
      case 'clear':
        return Icons.sun('#FCD34D');
      case 'rainy':
      case 'stormy':
        return Icons.rain();
      case 'snowy':
        return Icons.snow();
      default:
        return Icons.cloud();
    }
  },
};

/* ─────────────────────────────────────────────────────────────────
   APPLICATION STATE
───────────────────────────────────────────────────────────────── */

const state = {
  unit:    'C',         // 'C' | 'F'
  city:    '',          // displayed city name
  lat:     null,
  lon:     null,
  data:    null,        // raw Open-Meteo response
  loading: false,
};

/* ─────────────────────────────────────────────────────────────────
   DOM REFERENCES  (queried once at start)
───────────────────────────────────────────────────────────────── */

const dom = {
  body:           document.getElementById('app-body'),
  cityInput:      document.getElementById('city-input'),
  searchBtn:      document.getElementById('search-btn'),
  suggestions:    document.getElementById('suggestions-list'),
  btnC:           document.getElementById('btn-celsius'),
  btnF:           document.getElementById('btn-fahrenheit'),
  loadingOverlay: document.getElementById('loading-overlay'),
  errorBanner:    document.getElementById('error-banner'),
  errorMsg:       document.getElementById('error-message'),
  cityName:       document.getElementById('city-name'),
  cityDate:       document.getElementById('city-date'),
  currentTemp:    document.getElementById('current-temp'),
  weatherIconHero:document.getElementById('weather-icon-hero'),
  conditionText:  document.getElementById('condition-text'),
  feelsLike:      document.getElementById('feels-like'),
  humidityText:   document.getElementById('humidity-text'),
  heroBgArt:      document.getElementById('hero-bg-art'),
  windSpeed:      document.getElementById('wind-speed'),
  uvIndex:        document.getElementById('uv-index'),
  pressureText:   document.getElementById('pressure-text'),
  precipProb:     document.getElementById('precip-prob'),
  visibility:     document.getElementById('visibility'),
  forecastGrid:   document.getElementById('forecast-grid'),
  iconWind:       document.getElementById('icon-wind'),
  iconUV:         document.getElementById('icon-uv'),
  iconPrecip:     document.getElementById('icon-precip'),
  iconVis:        document.getElementById('icon-vis'),
};

/* ─────────────────────────────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────────────────────────────── */

/**
 * Convert Celsius to Fahrenheit, rounded to 1 decimal.
 * @param {number} c
 * @returns {number}
 */
const toF = (c) => Math.round((c * 9 / 5 + 32) * 10) / 10;

/**
 * Format temperature string with unit symbol.
 * @param {number} c  – value in Celsius
 * @param {'C'|'F'} unit
 * @returns {string}
 */
const fmtTemp = (c, unit = state.unit) => {
  const val = unit === 'C' ? Math.round(c) : toF(c);
  return `${val}°${unit}`;
};

/**
 * Return WMO code info or a sensible fallback.
 * @param {number} code
 */
const getWmo = (code) => WMO_CODES[code] ?? { label: 'Unknown', theme: 'clear', svgKey: 'sun' };

/**
 * Show / hide the loading overlay.
 * @param {boolean} visible
 */
const setLoading = (visible) => {
  dom.loadingOverlay.hidden = !visible;
  state.loading = visible;
};

/**
 * Show an error message and hide the loading overlay.
 * @param {string} msg
 */
const showError = (msg) => {
  setLoading(false);
  dom.errorBanner.hidden = false;
  dom.errorMsg.textContent = msg;
};

/** Clear error banner */
const clearError = () => { dom.errorBanner.hidden = true; };

/* ─────────────────────────────────────────────────────────────────
   API CALLS
───────────────────────────────────────────────────────────────── */

/**
 * Fetch city suggestions from the Geocoding API.
 * @param {string} query
 * @returns {Promise<Array>}
 */
const fetchSuggestions = async (query) => {
  const url = `${API.GEOCODING}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();
  return data.results ?? [];
};

/**
 * Fetch full forecast from Open-Meteo.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>}
 */
const fetchForecast = async (lat, lon) => {
  const params = new URLSearchParams({
    latitude:                lat,
    longitude:               lon,
    current:                 [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'precipitation_probability',
      'surface_pressure',
      'visibility',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'uv_index_max',
    ].join(','),
    wind_speed_unit: 'kmh',
    timezone:        'auto',
    forecast_days:   7,
  });

  const url = `${API.FORECAST}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast request failed (${res.status})`);
  return res.json();
};

/* ─────────────────────────────────────────────────────────────────
   RENDER FUNCTIONS
───────────────────────────────────────────────────────────────── */

/**
 * Per-theme tint palette injected as CSS custom properties on :root.
 * These drive the liquid-glass inner highlight and hero card corner wash.
 *
 * tint      → main ambient glow (used in box-shadow and hero ::before)
 * tint-soft → faint version for hover glow and secondary corner
 * tint-hard → saturated accent for future use / active states
 */
const THEME_TINTS = {
  clear:  {
    tint:      'rgba(251, 191,  36, 0.22)',  // warm golden-amber
    soft:      'rgba(251, 191,  36, 0.07)',
    hard:      'rgba(251, 191,  36, 0.50)',
  },
  rainy:  {
    tint:      'rgba( 99, 102, 241, 0.26)',  // cool indigo-slate
    soft:      'rgba( 99, 102, 241, 0.09)',
    hard:      'rgba( 99, 102, 241, 0.55)',
  },
  stormy: {
    tint:      'rgba( 79,  70, 229, 0.28)',  // deep oceanic indigo
    soft:      'rgba( 79,  70, 229, 0.10)',
    hard:      'rgba( 79,  70, 229, 0.55)',
  },
  cloudy: {
    tint:      'rgba(100, 116, 139, 0.24)',  // neutral dark-grey teal
    soft:      'rgba(100, 116, 139, 0.08)',
    hard:      'rgba(100, 116, 139, 0.48)',
  },
  snowy:  {
    tint:      'rgba(186, 230, 253, 0.20)',  // pale arctic blue
    soft:      'rgba(186, 230, 253, 0.07)',
    hard:      'rgba(186, 230, 253, 0.45)',
  },
  night:  {
    tint:      'rgba(109,  40, 217, 0.26)',  // cosmic purple
    soft:      'rgba(109,  40, 217, 0.09)',
    hard:      'rgba(139,  92, 246, 0.50)',
  },
};

/**
 * Apply atmospheric theme class to the body element AND inject
 * per-theme tint CSS variables onto :root so the liquid-glass
 * card highlights respond dynamically to weather conditions.
 *
 * @param {string} theme – 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'night'
 */
const applyTheme = (theme) => {
  // 1. Swap body class for background-image gradient
  const allThemes = ['theme-clear', 'theme-cloudy', 'theme-rainy', 'theme-stormy', 'theme-snowy', 'theme-night'];
  dom.body.classList.remove(...allThemes);
  dom.body.classList.add(`theme-${theme}`);

  // 2. Inject tint variables — fall back to 'cloudy' neutral if unknown
  const tints = THEME_TINTS[theme] ?? THEME_TINTS.cloudy;
  const root  = document.documentElement.style;
  root.setProperty('--theme-tint',      tints.tint);
  root.setProperty('--theme-tint-soft', tints.soft);
  root.setProperty('--theme-tint-hard', tints.hard);
};

/**
 * Determine if local time at the city is night-time (roughly 19:00–06:00).
 * Uses the timezone string returned by Open-Meteo.
 * @param {string} timezone  e.g. "Asia/Jakarta"
 * @returns {boolean}
 */
const isNightTime = (timezone) => {
  try {
    const localHour = new Date(
      new Date().toLocaleString('en-US', { timeZone: timezone })
    ).getHours();
    return localHour >= 19 || localHour < 6;
  } catch {
    return false;
  }
};

/**
 * Render the hero card with current weather data.
 */
const renderHero = () => {
  const { data, city, unit } = state;
  const cur = data.current;
  const wmo = getWmo(cur.weather_code);

  // Determine effective theme (night overrides clear/cloudy)
  const nightMode = isNightTime(data.timezone);
  const effectiveTheme = nightMode && (wmo.theme === 'clear' || wmo.theme === 'cloudy')
    ? 'night'
    : wmo.theme;

  applyTheme(effectiveTheme);

  // Date string
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  dom.cityName.textContent    = city;
  dom.cityDate.textContent    = dateStr;
  dom.currentTemp.textContent = fmtTemp(cur.temperature_2m, unit);
  dom.conditionText.textContent = wmo.label;
  dom.feelsLike.textContent   = `Feels like ${fmtTemp(cur.apparent_temperature, unit)}`;
  dom.humidityText.textContent = `Humidity ${cur.relative_humidity_2m}%`;

  // Weather icon (use night-appropriate sun for clear night)
  const iconKey = nightMode && wmo.svgKey === 'sun' ? 'partcloud' : wmo.svgKey;
  dom.weatherIconHero.innerHTML = Icons[iconKey]?.() ?? Icons.sun();

  // Hero decorative background art
  dom.heroBgArt.innerHTML = Icons.heroArt(effectiveTheme);
};

/**
 * Render the 4 KPI metric cards.
 */
const renderKPI = () => {
  const { data } = state;
  const cur = data.current;
  const daily = data.daily;

  // KPI icons
  dom.iconWind.innerHTML   = Icons.wind();
  dom.iconUV.innerHTML     = Icons.uv();
  dom.iconPrecip.innerHTML = Icons.precip();
  dom.iconVis.innerHTML    = Icons.eye();

  dom.windSpeed.textContent   = cur.wind_speed_10m != null
    ? Math.round(cur.wind_speed_10m)
    : '—';

  // UV index — use today's daily max (more meaningful than current which may be 0)
  const uvVal = daily?.uv_index_max?.[0] != null
    ? daily.uv_index_max[0].toFixed(1)
    : '—';
  dom.uvIndex.textContent    = uvVal;
  dom.pressureText.textContent = cur.surface_pressure != null
    ? `Pressure ${Math.round(cur.surface_pressure)} hPa`
    : 'Pressure —';

  dom.precipProb.textContent = cur.precipitation_probability != null
    ? cur.precipitation_probability
    : (daily?.precipitation_probability_max?.[0] ?? '—');

  // Visibility is returned in metres — convert to km
  dom.visibility.textContent = cur.visibility != null
    ? (cur.visibility / 1000).toFixed(1)
    : '—';
};

/**
 * Render the 7-day forecast grid.
 */
const renderForecast = () => {
  const { data, unit } = state;
  const { daily } = data;
  const todayIndex = 0;

  const fragment = document.createDocumentFragment();

  daily.time.forEach((dateStr, i) => {
    const wmo  = getWmo(daily.weather_code[i]);
    const date = new Date(dateStr + 'T12:00:00'); // noon to avoid UTC offset day-shift
    const day  = DAYS[date.getDay()];
    const iconKey = wmo.svgKey;
    const isToday = i === todayIndex;

    const card = document.createElement('div');
    card.className = `forecast-card${isToday ? ' today' : ''}`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label',
      `${isToday ? 'Today' : day}: ${wmo.label}, ` +
      `high ${fmtTemp(daily.temperature_2m_max[i], unit)}, ` +
      `low ${fmtTemp(daily.temperature_2m_min[i], unit)}`
    );

    card.innerHTML = `
      <span class="fc-day">${isToday ? 'Today' : day}</span>
      <div class="fc-icon">${Icons[iconKey]?.() ?? Icons.cloud()}</div>
      <span class="fc-max">${fmtTemp(daily.temperature_2m_max[i], unit)}</span>
      <span class="fc-min">${fmtTemp(daily.temperature_2m_min[i], unit)}</span>
    `;

    fragment.appendChild(card);
  });

  dom.forecastGrid.innerHTML = '';
  dom.forecastGrid.appendChild(fragment);
};

/**
 * Re-render only temperature-dependent elements when the unit changes.
 * Avoids a full API re-fetch.
 */
const rerenderTemps = () => {
  if (!state.data) return;
  const { data, unit } = state;
  const cur = data.current;

  dom.currentTemp.textContent   = fmtTemp(cur.temperature_2m, unit);
  dom.feelsLike.textContent     = `Feels like ${fmtTemp(cur.apparent_temperature, unit)}`;
  renderForecast(); // forecast cards show min/max temps
};

/* ─────────────────────────────────────────────────────────────────
   MAIN DATA LOAD ORCHESTRATOR
───────────────────────────────────────────────────────────────── */

/**
 * Fetch weather for a specific lat/lon + city name, then render all components.
 * @param {string} cityName
 * @param {number} lat
 * @param {number} lon
 */
const loadWeather = async (cityName, lat, lon) => {
  clearError();
  setLoading(true);

  try {
    const data = await fetchForecast(lat, lon);

    // Persist to state
    state.city = cityName;
    state.lat  = lat;
    state.lon  = lon;
    state.data = data;

    // Render all sections
    renderHero();
    renderKPI();
    renderForecast();

  } catch (err) {
    console.error('[SkyPulse] Failed to load weather:', err);
    showError('Could not fetch weather data. Please check your connection and try again.');
  } finally {
    setLoading(false);
  }
};

/* ─────────────────────────────────────────────────────────────────
   SEARCH / AUTOCOMPLETE
───────────────────────────────────────────────────────────────── */

/** Debounce timer handle */
let suggestTimer = null;

/** Close suggestions dropdown */
const closeSuggestions = () => {
  dom.suggestions.hidden = true;
  dom.suggestions.innerHTML = '';
  dom.cityInput.setAttribute('aria-expanded', 'false');
};

/**
 * Populate and show the suggestions list.
 * @param {Array} results
 */
const showSuggestions = (results) => {
  dom.suggestions.innerHTML = '';

  if (!results.length) {
    closeSuggestions();
    return;
  }

  results.forEach((place) => {
    const li = document.createElement('li');
    li.className = 'suggestion-item';
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', 'false');
    li.tabIndex = 0;

    const countryPart = [place.admin1, place.country].filter(Boolean).join(', ');
    li.innerHTML = `<strong>${place.name}</strong><span class="sug-country">${countryPart}</span>`;

    const selectPlace = () => {
      dom.cityInput.value = place.name;
      closeSuggestions();
      loadWeather(place.name, place.latitude, place.longitude);
    };

    li.addEventListener('click', selectPlace);
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPlace(); }
    });

    dom.suggestions.appendChild(li);
  });

  dom.suggestions.hidden = false;
  dom.cityInput.setAttribute('aria-expanded', 'true');
};

/** Handle typing in the search input (debounced). */
dom.cityInput.addEventListener('input', () => {
  clearTimeout(suggestTimer);
  const q = dom.cityInput.value.trim();

  if (q.length < 2) { closeSuggestions(); return; }

  suggestTimer = setTimeout(async () => {
    try {
      const results = await fetchSuggestions(q);
      showSuggestions(results);
    } catch {
      closeSuggestions();
    }
  }, 320); // 320ms debounce
});

/** Handle Enter key in search input — pick first suggestion or search directly. */
dom.cityInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Escape') { closeSuggestions(); return; }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const first = dom.suggestions.querySelector('.suggestion-item');
    if (first) first.focus();
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    clearTimeout(suggestTimer);
    const q = dom.cityInput.value.trim();
    if (!q) return;

    closeSuggestions();
    setLoading(true);
    clearError();

    try {
      const results = await fetchSuggestions(q);
      if (!results.length) {
        showError(`No location found for "${q}". Please try a different city name.`);
        return;
      }
      const place = results[0];
      dom.cityInput.value = place.name;
      loadWeather(place.name, place.latitude, place.longitude);
    } catch {
      showError('Search failed. Please check your connection and try again.');
    }
  }
});

/** Handle search button click. */
dom.searchBtn.addEventListener('click', async () => {
  const q = dom.cityInput.value.trim();
  if (!q) return;

  clearTimeout(suggestTimer);
  closeSuggestions();
  setLoading(true);
  clearError();

  try {
    const results = await fetchSuggestions(q);
    if (!results.length) {
      showError(`No location found for "${q}". Please try a different city name.`);
      return;
    }
    const place = results[0];
    dom.cityInput.value = place.name;
    loadWeather(place.name, place.latitude, place.longitude);
  } catch {
    showError('Search failed. Please check your connection and try again.');
  }
});

/** Close suggestions when clicking outside. */
document.addEventListener('click', (e) => {
  if (!dom.cityInput.contains(e.target) && !dom.suggestions.contains(e.target)) {
    closeSuggestions();
  }
});

/* ─────────────────────────────────────────────────────────────────
   UNIT TOGGLE
───────────────────────────────────────────────────────────────── */

dom.btnC.addEventListener('click', () => {
  if (state.unit === 'C') return;
  state.unit = 'C';
  dom.btnC.classList.add('active');
  dom.btnC.setAttribute('aria-pressed', 'true');
  dom.btnF.classList.remove('active');
  dom.btnF.setAttribute('aria-pressed', 'false');
  rerenderTemps();
});

dom.btnF.addEventListener('click', () => {
  if (state.unit === 'F') return;
  state.unit = 'F';
  dom.btnF.classList.add('active');
  dom.btnF.setAttribute('aria-pressed', 'true');
  dom.btnC.classList.remove('active');
  dom.btnC.setAttribute('aria-pressed', 'false');
  rerenderTemps();
});

/* ─────────────────────────────────────────────────────────────────
   BOOTSTRAP — load default city on first render
───────────────────────────────────────────────────────────────── */

loadWeather(DEFAULT_LOCATION.name, DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
