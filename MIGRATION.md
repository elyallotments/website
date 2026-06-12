# Migration Plan — Weebly export → Eleventy + Tailwind

Goal: rebuild the City of Ely Allotments site as a static, Eleventy-generated
site with shared layout/menu/footer and Tailwind styling, **keeping all text,
pages, links and photos** from the original, while **dropping all original
styling and JavaScript**.

The original Weebly export is preserved under [`_original/`](./_original) as the
content source of truth. It is excluded from the Eleventy build
(see `.eleventyignore`) and should be deleted only once every page is migrated
and checked off below.

---

## Status at a glance

| Phase | What | State |
| ----- | ---- | ----- |
| 0 | Cache-bust rename of `?`-named files | ✅ N/A — export has none (see note) |
| 1 | Scaffold Eleventy + Tailwind, scripts | ✅ Done |
| 2 | Shared base layout, dynamic menu, footer | ✅ Done |
| 3 | Carousel component (CSS scroll-snap) | ✅ Done; wired into Bridge Fen, New Barns, Upherds Lane |
| 4 | Page-by-page content migration | ✅ All 14 pages migrated |
| 5 | Forms & maps replacement | ◑ Maps + YouTube done; Apply form live; Contact/Stores forms await Google Form URLs |
| 6 | SEO, redirects, polish | ⬜ |
| 7 | Deploy | ⬜ |

---

## Phase 0 — Cache-bust `?` filenames *(N/A)*

The brief called for renaming files with `?` in their name and updating their
HTML references first. **The export contains none**: no file on disk has a `?`,
and no local `href`/`src` carries a query string. The only `?...` strings are on
external Weebly/Google CDN URLs (`...?buildtime=`), which are being removed
wholesale anyway. No action required. If a future re-export introduces such
files, rename `name.ext?123` → `name.ext` and update references with a
find/replace before anything else.

## Phase 1 — Scaffold *(done)*

- `npm` project, ESM (`"type": "module"`).
- Dependencies: `@11ty/eleventy@3`, `tailwindcss@4` + `@tailwindcss/cli@4`,
  `concurrently`.
- Scripts (see `package.json`):
  - `npm run serve` — dev server with live reload; runs Tailwind `--watch` and
    `eleventy --serve` together via `concurrently`.
  - `npm run build` — clean, build minified CSS, then build HTML to `_site/`.
- `eleventy.config.js` — input `src/`, output `_site/`, passthrough-copies
  `src/uploads` → `/uploads` (photos & PDFs, **original paths preserved**) and
  `src/js` → `/js`.
- Tailwind v4 CSS-first config in `src/css/main.css` (`@theme` brand tokens).

## Phase 2 — Shared layout, menu, footer *(done)*

- `src/_includes/layouts/base.njk` — single base layout (doctype, head, fonts,
  skip link, nav, `<main>`, footer, one `<script>`). Applied to every page via
  the `src/src.11tydata.json` data-cascade default.
- **Dynamic menu** driven by data, not hand-written per page:
  - `src/_data/nav.json` defines the menu tree (top-level + children) and the
    footer links. Edit this one file to change navigation everywhere.
  - `src/_includes/partials/nav.njk` renders it: responsive, sticky header,
    desktop hover/focus dropdowns, mobile hamburger. Current page is marked with
    `aria-current` by comparing `page.url`.
- `src/_includes/partials/footer.njk` — footer links + copyright (`{% year %}`
  shortcode).
- `src/_data/site.json` — site name, description, URL, and form embed URLs.

## Phase 3 — Carousel *(component done)*

- Chosen approach: **pure CSS scroll-snap**, no library. JS is progressive
  enhancement only.
- `src/_includes/partials/carousel.njk` — a Nunjucks `carousel(images)` macro.
  `images` is a list of `{ src, alt, caption }`. Without JS it is a swipeable
  scroll strip; `src/js/site.js` adds prev/next buttons and dot indicators.
- **TODO:** wire galleries into the photo-heavy pages (Bridge Fen 21, New Barns
  18, Upherds Lane 14, Sites 10 images). Pattern:
  ```njk
  {% from "partials/carousel.njk" import carousel %}
  {% set bridgeFenPhotos = [
    { src: "/uploads/.../dji-0031-bf-sc_orig.jpg", alt: "Aerial view of Bridge Fen", caption: "" }
  ] %}
  {{ carousel(bridgeFenPhotos, "Bridge Fen photos") }}
  ```
  Consider moving long image lists into a page-level `_data` / front-matter list
  to keep templates tidy.

## Phase 4 — Page-by-page content migration

For each page: copy the **text, links, and photos** from the matching
`_original/*.html` into a clean `src/<slug>.njk` (or `.md`), wrapped in Tailwind
layout. Strip all Weebly markup, inline styles, `wsite-*` classes, spacers,
cookie notices, and analytics. Rewrite internal links `foo.html` → `/foo/`.
Rewrite image `src` to root-absolute `/uploads/...` (paths already preserved).

| Page | Source | New file | Notes | Done |
| ---- | ------ | -------- | ----- | ---- |
| Home | `index.html` | `src/index.njk` | Hero + intro + seasonal quote | ✅ |
| About | `about.html` | `src/about.njk` | Links to History; 25-years article PDF | ✅ |
| History | `history.html` | `src/history.njk` | Orphan (linked from About). History PDF wasn't in the export — link points to the live absolute URL | ✅ |
| Info | `info.html` | `src/info.njk` | Largest page; sections + PDF/links (no YouTube embed, just a text link) | ✅ |
| Contact | `contact.html` | `src/contact.njk` | Dead Weebly form removed → Google Form embed via `site.forms.contactEmbedSrc` (shows fallback until URL set) | ✅ |
| Apply for a plot | `apply-for-a-plot.html` | `src/apply-for-a-plot.njk` | Google Form iframe (live, from `site.forms.applyEmbedSrc`) | ✅ |
| Sites | `sites.html` | `src/sites.njk` | Overview grid + 4 site descriptions + Plot Rents table (no map on this page) | ✅ |
| Bridge Fen | `bridge-fen.html` | `src/bridge-fen.njk` | 25 photos (2 carousels) + map (52.3859753, 0.2734526) | ✅ |
| Canterbury Avenue | `canterbury-avenue.html` | `src/canterbury-avenue.njk` | 2 photos (inline) + map (52.3947446, 0.2469342) | ✅ |
| New Barns | `new-barns.html` | `src/new-barns.njk` | Carousels + 2 YouTube (nocookie) + map (52.4052703, 0.2763436) | ✅ |
| Upherds Lane | `upherds-lane.html` | `src/upherds-lane.njk` | 12 photos (2 carousels) + map (52.4024143, 0.2560077) | ✅ |
| Stores | `stores.html` | `src/stores.njk` | Address/hours + map (52.4053573, 0.265469) + orders form → Google Form embed (URL pending) | ✅ |
| Privacy Notice | `privacy-notice.html` | `src/privacy-notice.njk` | Links to PDF; obfuscated email decoded to mailto | ✅ |
| Rules of the Association | `rules-of-the-association.html` | `src/rules-of-the-association.njk` | Links to NAS model rules PDF | ✅ |

**Outstanding before launch:**
- Set `site.forms.contactEmbedSrc` (and a Stores orders form URL) in `src/_data/site.json` once the Google Forms exist — Contact and Stores currently show a fallback notice.
- The History article PDF (`ely_allotments_association__history.pdf`) was never in the export; the link now points to the live `elyallotmentsandgardens.org` copy. Download it into `src/uploads/...` to self-host, or leave as-is.
- Verify each site's map pin location looks right (coords were lifted from the old Weebly map URLs).

Tip: `.md` is fine for prose-heavy pages (Privacy, Rules, History); `.njk` is
better where carousels/maps/forms are embedded.

## Phase 5 — Forms & maps

Decisions made for this migration:

- **Contact form → Google Form** (consistent with the existing Apply page).
  Action: create the Google Form, then set
  `site.forms.contactEmbedSrc` in `src/_data/site.json`. The Apply page already
  has its embed URL in `site.forms.applyEmbedSrc`. Render embeds responsively:
  ```njk
  <iframe src="{{ site.forms.contactEmbedSrc }}" class="h-[1200px] w-full" loading="lazy"
          title="Contact form">Loading…</iframe>
  ```
  The original posted to Weebly's `formSubmit.php`, which dies on rehost — drop it.
- **Maps → Google Maps embed iframe.** The original used Weebly's
  `generateMap.php` (dies on rehost). Replace per site using the lat/long already
  in `_original/*.html`. Coordinates captured:
  | Site | lat | long |
  | ---- | --- | ---- |
  | (header section) | 52.4052703 | 0.27634360 |
  | (body section) | 52.3859753 | 0.27345260 |
  | (site page) | 52.4024143 | 0.25600770 |
  | (site page) | 52.3947446 | 0.24693420 |
  | (site page) | 52.4053573 | 0.26546900 |

  Match each coordinate pair to its site by checking which `_original` page it
  appears in. Use a standard embed:
  ```html
  <iframe class="h-[400px] w-full rounded-lg" loading="lazy"
    src="https://www.google.com/maps?q=52.4024143,0.2560077&z=16&output=embed"
    title="Map of …"></iframe>
  ```
- **YouTube embeds** (`info.html`: `53WZm-x7MqM`, `FNfo5Z0uS8Y`) — keep, but
  switch to `https://www.youtube-nocookie.com/embed/<id>` and wrap in a
  responsive 16:9 container.

## Phase 6 — Polish

- Sitemap + `robots.txt`; per-page `title`/`description` front matter.
- 404 page.
- Redirects from old `*.html` URLs to new clean URLs (host-dependent — e.g.
  Netlify `_redirects` / Cloudflare rules), so external links keep working.
- Favicon / touch icons.
- Run through the cookie/privacy implications: with Weebly analytics gone and
  maps via Google embed, update the Privacy Notice text accordingly.

## Phase 7 — Deploy

- Static host (Netlify / Cloudflare Pages / GitHub Pages). Build command
  `npm run build`, publish directory `_site`.
- Point DNS for `elyallotmentsandgardens.org` once verified.

---

## Conventions

See [CLAUDE.md](./CLAUDE.md) for project assumptions and conventions to follow
during the remaining migration work.
