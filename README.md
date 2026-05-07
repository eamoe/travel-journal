# The Travel Journal

A minimalist, single-page travel chronicle engineered with **React (Vite)** and **Tailwind CSS**. This project features 
a clean, editorial-style timeline designed to document global journeys through high-impact typography and a refined,
modern aesthetic.

---

## ✨ Features

* **Chronological Travel Feed** - A vertical timeline of journal entries sorted reverse-chronologically (newest first).
* **Locality-Aware Date Formatting** - Timestamps automatically adapt their syntax, month names, and hour cycles (12h/24h) based on the selected language via the Intl API.
* **Bilingual Narrative & UI Support** - A complete dual-language system where both journal content and interface elements (buttons, headers, footers) toggle dynamically.
* **Location-Locked Timestamps** - Precise date and time formatting that preserves the local time of the destination, regardless of the viewer's timezone.
* **Structured Content Architecture** - A clean `posts.json` schema with localized content fields for easy multi-language editing.
* **Mediterranean Design System** - A minimalist, mobile-first aesthetic inspired by coastal landscapes.
* **Interactive Media** - High-quality photography with image lightboxes and zoom functionality.
* **Flexible Narratives** - Support for markdown-based content with expandable "read more" sections for long-form observations.
* **External Map Integration** – Interactive location badges that launch the destination directly in Google Maps or native map apps.

---

## 🛠 Tech Stack

* React (Vite)
* Tailwind CSS
* react-markdown
* Intl API (Native Browser Localization)
* GitHub Pages (deployment)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run locally

```bash
pnpm run dev
```

Open:
http://localhost:5173

---

## 📝 Editing Content

All posts are stored in a centralized JSON database:

```
/public/posts.json
```

Each post follows a multi-layered, localized format to support map integration and internationalization:

```json
{
  "id": "2026-04-12-1430-rome",
  "date": "2026-04-12T14:30:00",
  "location": {
    "lat": 41.9099533,
    "lng": 12.3711899,
    "name": {
      "en": "Rome, Italy",
      "local": "Roma, Italia"
    }
  },
  "content": {
    "en": {
      "title": "Rome - First Arrival",
      "description": "Arrived in Rome on a Saturday afternoon... [Markdown supported]"
    },
    "local": {
      "title": "Roma - Primo Arrivo",
      "description": "Arrivato a Roma un sabato pomeriggio, quel tipo di pomeriggio in cui la città sembra addolcirsi ai bordi... [Markdown supportato]"
    }
  },
  "images": [
    {
      "src": "images/rome.jpg",
      "alt": {
        "en": "View of the Colosseum at sunset",
        "local": "Vista del Colosseo al tramonto"
      }
    }
  ]
}
```

* Content supports **Markdown**
* Images should be placed in `/public/images/`
* The `images` array supports multiple entries — the first becomes the hero; up to four more render as thumbnails under the card and open the lightbox at their own index. A `+N` overlay appears on the fourth thumbnail when more remain.

### Image optimization

Source photos go in `/public/images/` as a single `.jpg` (or `.png`) per entry. A build-time script generates AVIF / WebP / JPG variants at 400, 800, and 1600 widths into `/public/images/optimized/`, served via `<picture>` + `srcset`.

```bash
pnpm run images
```

The script is idempotent (skips up-to-date variants) and runs automatically as `prebuild` before `pnpm run build`. Commit the generated `/public/images/optimized/` folder so `pnpm run dev` works without a prior build step.

---

## ⚙️ Wildcard Localization

To change the secondary language (the "Wildcard"):

1. **Configure Locale**: Open `src/config.ts` to update the label (e.g., "IT") and the locale tag (e.g., it-IT) for proper date formatting.
2. **Translate Interface**: Open `src/translations.ts` and update the values under the `local` key (e.g., changing "Читать далее" to "Leggi tutto").
3. **Update Assets**: Place a new flag icon in `/public/flags/` and update the path in `src/config.ts`.

## 🌍 Deployment (GitHub Pages)

This project uses `gh-pages` for deployment.

### Deploy

```bash
pnpm run deploy
```

This will:

- Run the `predeploy` script → builds the project (`tsc -b && vite build`)
- Publish the `/dist` folder to the `gh-pages` branch

---

### GitHub Pages Setup

In your repository settings:

- Go to **Settings** → **Pages**
- Set:
  - **Source**: Deploy from branch
  - **Branch**: `gh-pages`
  - **Folder**: `/ (root)`

### Live URL

Your site will be available at:

`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## ⚙️ Important Configuration

### Vite Base Path

Ensure `vite.config.js` includes:

```js
base: '/YOUR_REPO_NAME/'
```

This is required for GitHub Pages to work correctly.

---

## 📱 Design Principles

* Minimalist, editorial layout
* Generous whitespace
* Mobile-first readability
* Warm Mediterranean color palette

---

## 📌 Future Improvements

* **Interactive Map View** - A global map overview showing all journal entry pins.
* **Post filtering** – Categorize entries by region (e.g., Tuscany, Amalfi, Veneto).
* **Search** – Simple client-side search for specific locations or keywords.

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

**What this means**:

- **Share & Remix**: You are free to copy, distribute, and modify this software.
- **Keep it Open**: If you modify this project and distribute a version of it, you must make your source code public under the same GPL-3.0 license.
- **No "Closed" Commercial Use**: You cannot take this code, modify it, and sell it as a closed-source proprietary product.

For more details, see the [LICENSE](LICENSE) file included in this repository.

_**Note**: The source code is GPLv3, but the travel photography and written entries are Copyright © 2026 Eugene Menski (eamoe)._
