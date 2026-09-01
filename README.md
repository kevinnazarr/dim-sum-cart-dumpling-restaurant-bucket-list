# Dim Sum Cart — Dumpling Restaurant Bucket List

Warm, menu-card-styled personal bucket list for dim sum restaurants. Single-page, no backend, localStorage.

## Stack
React + TypeScript + Vite + Tailwind CSS + lucide-react

## Features
- Add/edit/delete (name, city, status, 1-5 🥟 rating required for Been There, dish, note)
- Filter All / Want to Try / Been There, search, sort (newest/alpha/rating)
- Summary bar, empty states, inline validation, Surprise Me, Export JSON
- Responsive 360px→desktop, keyboard + ARIA, steam micro-animation, persisted prefs

## Run
```bash
npm install
npm run dev
npm run build
```

## Persistence
`localStorage` keys: `dimsum-cart:entries`, `dimsum-cart:prefs` — safe fallback on corrupted data.
