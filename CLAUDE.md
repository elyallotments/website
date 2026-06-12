# CLAUDE.md

Guidance for working in this repository.

## What this is

The website for the **City of Ely Allotments and Gardens Association Ltd**
(Ely, Cambridgeshire, UK — *not* Ely in Cardiff). It is being migrated from a
Weebly static export to an **Eleventy (11ty) + Tailwind CSS** static site.

The active migration plan and per-page checklist live in
[MIGRATION.md](./MIGRATION.md) — **read it before doing migration work** and keep
its status table up to date as pages are completed.

## Project assumptions / conventions

### Stack
- **Eleventy 3.x**, ESM config (`eleventy.config.js`, `"type": "module"`).
- **Tailwind CSS v4**, CSS-first config (no `tailwind.config.js`). Theme tokens
  live in the `@theme` block of `src/css/main.css`. CSS is built by the
  **standalone Tailwind CLI**, not a PostCSS/Eleventy plugin — it runs as a
  separate process alongside Eleventy.
- **Templating: Nunjucks** (`.njk`) for anything with layout/partials/macros;
  Markdown (`.md`) is fine for prose-only pages. `.html` files are also processed
  as Nunjucks.
- Node ≥ 18 (developed on Node 22).

### Commands
- `npm run serve` — dev server + live reload (Tailwind watch + Eleventy serve).
- `npm run build` — production build to `_site/` (clean → minified CSS → HTML).
- `npm run clean` — remove `_site/`.

### Layout
```
src/
  _data/        site.json (metadata, form URLs), nav.json (menu + footer tree)
  _includes/
    layouts/    base.njk — the single site layout
    partials/   nav.njk, footer.njk, carousel.njk (macro)
  css/main.css  Tailwind entry + @theme tokens + base styles
  js/site.js    the ONLY script: mobile menu + carousel enhancement
  uploads/      photos & PDFs — ORIGINAL paths preserved, passthrough-copied
  src.11tydata.json   sets the default layout for all pages
  *.njk / *.md  one file per page
_original/      the untouched Weebly export — content source, excluded from build
_site/          build output (gitignored)
```

### Rules of the road
- **Keep all content.** Migration preserves every page's text, links, and photos.
  Do not silently drop content; if something can't carry over (e.g. a dead
  Weebly widget), note it in MIGRATION.md.
- **Drop all original styling and JS.** No `wsite-*` classes, inline styles,
  Weebly/Snowplow/Google-Analytics scripts, or cookie-opt-out widgets. Style with
  Tailwind utilities only.
- **One script.** `src/js/site.js` is the only JavaScript and is
  progressive-enhancement only — pages must work with JS disabled. Don't add
  client-side frameworks or jQuery.
- **The menu is data-driven.** Change navigation in `src/_data/nav.json`, never by
  editing markup in individual pages. The same applies to the footer links.
- **Clean URLs.** Pages output to `/slug/` (e.g. `about.njk` → `/about/`).
  Rewrite internal links from the old `foo.html` to `/foo/`. Old→new redirects
  are handled at the host (see MIGRATION.md Phase 6).
- **Photos keep their paths.** Images live under
  `src/assets/uploads/...` and are referenced root-absolute as
  `/uploads/...`. Don't rename or restructure unless you also update every
  reference (and prefer doing it as one deliberate pass, not incrementally).
- **Carousels** use the `carousel(images)` macro in
  `_includes/partials/carousel.njk` (pure CSS scroll-snap). Don't introduce a
  carousel library. Enhancements live in `src/js/site.js`: prev/next + dots,
  mouse drag-to-pan (mouse only — touch/trackpad use native scroll), and a
  shared full-screen **lightbox** (the overlay markup is in `base.njk`; click any
  photo to open; Esc/arrow keys, focus trap, backdrop-click to close). All of it
  is progressive enhancement — photos still show without JS.
- **Tailwind scans `.js` too** (`@source` in `main.css` includes `.js`), because
  `site.js` toggles utility classes (e.g. `cursor-grab`, `scale-100`,
  `bg-brand-green`). If you add a class only in JS, it will still be generated —
  but keep an eye on this when refactoring the `@source` globs.
- **Forms** are Google Form embeds; URLs live in `site.forms` in
  `src/_data/site.json`. **Maps** are Google Maps embed iframes built from the
  lat/long captured in MIGRATION.md. The original Weebly `formSubmit.php` /
  `generateMap.php` endpoints are dead — never link to them.
- **Brand:** headings `Montserrat`, body `Lora` (Google Fonts); colours via the
  `brand-green` / `brand-gold` / `brand-ink` Tailwind tokens.
- **Language: British English** throughout (e.g. "colour", "organisation",
  "neighbour"). Content and UI copy alike.
- **"Ely" is a city name — always capitalise it.** Never render it lowercase,
  including in the wordmark/logo. (The original Weebly site stylised it as a
  lowercase "ely Allotments"; do not reproduce that.)

### When adding a page
1. Create `src/<slug>.njk` (or `.md`) with front matter `title:`.
2. Add it to `src/_data/nav.json` if it belongs in the menu.
3. Migrate text/links/photos from `_original/<slug>.html`; strip Weebly markup.
4. Build (`npm run build`) and check the output; tick it off in MIGRATION.md.
