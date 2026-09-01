---
version: "alpha"
name: "Dim Sum Cart Design System"
description: "A warm, menu-card-inspired design system for a personal dim sum restaurant bucket list app — steamer basket textures, bold market-stall typography, and tactile card interactions."

colors:
  primary: "#C0392B"
  secondary: "#D98E04"
  background: "#FBF3E7"
  surface: "#FFFDF8"
  text: "#3A2318"
  text-muted: "#7A6555"
  border: "#E4D2B8"
  success: "#4C7A4C"
  warning: "#B8860B"
  danger: "#A5302A"

typography:
  display:
    fontFamily: "'Fraunces', 'Georgia', serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: "1.1"
  heading:
    fontFamily: "'Fraunces', 'Georgia', serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "1.25"
  body:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5"
  label:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600

rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  pill: "999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"

  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"

  badge:
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

## Overview

Dim Sum Cart should feel like flipping through a well-loved dim sum order card at a busy Cantonese teahouse: warm terracotta and gold tones, a bamboo-steamer-adjacent surface texture, confident serif headings for restaurant names, and clean sans-serif body text for details. The design should feel personal and collected — like a scrapbook, not a SaaS dashboard. Every card is a "ticket" for one restaurant.

## Colors

- `primary` (terracotta red): primary actions, active filter state, "Been There" accents. Evokes lacquered dim sum carts and red-lidded steamer baskets.
- `secondary` (turmeric gold): highlights, must-order dish callouts, rating fill color alternative, hover accents.
- `background` (warm cream): page background — like unbleached parchment/menu paper.
- `surface` (near-white warm): card and modal backgrounds, sits clearly above `background`.
- `text` (deep espresso brown): primary text color, high contrast on both background and surface.
- `text-muted` (soft taupe): secondary text — city names, notes, helper copy.
- `border` (warm tan): card borders, dividers, input borders — never pure gray, always warm-toned.
- `success` (moss green): used sparingly for positive confirmation (e.g., "Saved").
- `warning` (amber): validation warnings, non-blocking notices (e.g., persistence failure).
- `danger` (deep red-brown): delete actions, destructive confirmations — distinct enough from `primary` to avoid confusion; pair with icon/text, never color alone.

## Typography

`display` is reserved for the app title only. `heading` is used for restaurant names on cards and section titles ("Your Wishlist", "Been There"). `body` handles all descriptive text: city, notes, form labels' helper text. `label` is used for form field labels, filter chip text, and the summary bar numbers' captions — always uppercase-tracked slightly for a "menu category" feel. Maintain generous line-height on `body` (1.5) for note text readability; headings stay tighter (1.1–1.25) for a bold, confident stamp-like feel.

## Layout

- Page content max-width: ~1120px, centered, with `spacing.lg` side padding on mobile shrinking to `spacing.md` below 400px.
- Card grid: CSS grid with `auto-fill`/`minmax(280px, 1fr)` so it naturally reflows from 1 → 2 → 3 columns as viewport grows.
- Vertical rhythm: sections separated by `spacing.xl`; within a card, elements separated by `spacing.sm`–`spacing.md`.
- Breakpoints: ~480px (small mobile), ~768px (tablet), ~1024px (desktop) — layout recomposes at each, not just scales.
- Density: comfortable, not cramped — cards should feel like distinct "tickets," with clear breathing room between them.

## Elevation & Depth

- Cards use a `border` (1px, `colors.border`) plus a very soft warm-toned shadow (avoid cool gray shadows — tint shadows toward brown/red at low opacity) rather than heavy drop shadows.
- Modals/panels sit on an `surface` background with a slightly stronger shadow and a scrim overlay (`text` color at low opacity) behind them.
- No glassmorphism, no blur-heavy overlays — keep depth solid and paper-like, consistent with a menu-card metaphor.

## Shapes

- Buttons: pill-shaped (`rounded.pill`) for primary/secondary actions — evokes a stamped order chit.
- Inputs: `rounded.md`, clear visible border, warm-toned focus ring (not default blue) using `primary` or `secondary` at full opacity for the ring.
- Cards: `rounded.lg`, generous corner rounding but not fully pill — should read as a "ticket," not a bubble.
- Badges/status pills: `rounded.pill`, small, used for status labels ("Been There" / "Want to Try").

## Components

### Buttons
Primary (Add Restaurant, Save): filled `primary` background, `surface` text, pill shape, bold label. Secondary (Cancel, filter chips when inactive): outlined or ghost style using `border`/`text-muted`. Destructive (Delete): outlined or filled `danger`, always paired with a trash icon and the word "Delete," never icon-only.

### Inputs
Labeled above the field (not placeholder-only), `rounded.md`, `border` colored border, warm focus ring, inline error text in `danger` below the field with an icon, not just red text.

### Cards (Entry)
Restaurant name in `heading` style at the top; city directly below in `text-muted body`; status badge top-right corner; dumpling rating row (if Been There) prominently below the name; "Order this:" label + dish in `secondary`-accented text; note in smaller `body`/`text-muted` text, possibly styled like a handwritten aside; edit/delete affordances revealed on hover/focus (and always visible/tappable on touch).

### Navigation / Filter Bar
Segmented control or chip group (All / Want to Try / Been There), active state filled `primary` with `surface` text, inactive states outlined; must be keyboard-navigable with arrow keys or tab+enter.

### Dialogs (Add/Edit Form, Delete Confirm)
Centered modal on tablet/desktop, near-full-screen slide-up panel on small mobile; scrim behind; focus trapped inside while open; clear close affordance (X and Escape key).

### Rating Input (Dumplings)
Five 🥟 icons in a row, unfilled/low-opacity by default, filled/full-opacity up to the selected value; clickable and keyboard-operable (arrow keys to adjust, enter/space to confirm); exposes value via accessible text for screen readers.

### Summary Bar
Two prominent stat blocks ("X Been There" / "Y Want to Try") in `label`-style captions with large numeric values in `heading`/`display`-adjacent weight, sitting directly under the app title.

### Empty States
Centered illustration-or-icon-adjacent moment (emoji is fine, e.g., 🧺), `heading`-styled message, `body` supporting text, and a `button-primary` CTA when appropriate (add-first-entry case).

## Do's and Don'ts

### Do
- Use warm, food-adjacent tones throughout (terracotta, gold, cream, espresso brown).
- Use the dumpling emoji rating consistently as the single rating metaphor.
- Keep card layout consistent regardless of status so filtering doesn't feel jarring.
- Use bold serif headings to give restaurant names presence, like a menu.

### Don't
- Don't use generic SaaS blues/purples or cool gray neutrals anywhere.
- Don't rely on color alone to distinguish "Want to Try" vs "Been There" — always pair with text/icon.
- Don't use glassmorphism, neon gradients, or decorative blobs — keep the paper/menu-card metaphor intact.
- Don't hide required actions (add, edit, delete, filter) behind unlabeled icon-only buttons.