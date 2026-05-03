# The Travel Journal

A minimalist, single-page travel chronicle engineered with **React (Vite)** and **Tailwind CSS**. This project features 
a clean, editorial-style timeline designed to document global journeys through high-impact typography and a refined,
modern aesthetic.

---

## ✨ Features

* **Chronological Travel Feed** - A vertical timeline of journal entries sorted reverse-chronologically (newest first).
* **Location-Locked Timestamps** - Precise date and time formatting that preserves the local time of the destination, regardless of the viewer's timezone.
* **Structured Content Architecture** - A clean `posts.json` schema with unique timestamp-based IDs and internal naming for easy editing.
* **Mediterranean Design System** - A minimalist, mobile-first aesthetic inspired by coastal landscapes.
* **Interactive Media** - High-quality photography with image lightboxes and zoom functionality.
* **Flexible Narratives** - Support for markdown-based content with expandable "read more" sections for long-form observations.

---

## 🛠 Tech Stack

* React (Vite)
* Tailwind CSS
* react-markdown
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

All posts are stored in:

```
/public/posts.json
```

Example structure:

```json
{
  "id": "1",
  "location": "Rome, Italy",
  "date": "2026-04-12T14:30:00",
  "image": "/images/rome.jpg",
  "alt": "Colosseum at sunset",
  "content": "Markdown content here..."
}
```

* Content supports **Markdown**
* Images should be placed in `/public/images/`

---

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

* Multi-language support (EN / `LANGUAGE`):
  * Store post content in multiple languages within `posts.json`
  * Add a language switcher in the header (EN / `LANGUAGE`)
  * Default to English with ability to toggle to `LANGUAGE`
* Post filtering by location
* Map integration
* Smooth animations refinement

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

**What this means**:

- **Share & Remix**: You are free to copy, distribute, and modify this software.
- **Keep it Open**: If you modify this project and distribute a version of it, you must make your source code public under the same GPL-3.0 license.
- **No "Closed" Commercial Use**: You cannot take this code, modify it, and sell it as a closed-source proprietary product.

For more details, see the [LICENSE](LICENSE) file included in this repository.

_**Note**: The source code is GPLv3, but the travel photography and written entries are Copyright © 2026 Eugene Menski (eamoe)._
