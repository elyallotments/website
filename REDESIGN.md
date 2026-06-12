# Redesign Specification — City of Ely Allotments & Gardens Association

A specification for restyling the migrated Eleventy + Tailwind site into a
**modern, nature-aligned design that is welcoming to all ages**, with content
corrections folded in. The migration is complete (all 14 pages live, see
[MIGRATION.md](./MIGRATION.md)); this document covers the *visual and content
redesign* layered on top of it.

> Scope note: this is a styling + content pass, **not** a re-platform. Everything
> here is achievable within the existing constraints in [CLAUDE.md](./CLAUDE.md):
> Eleventy 3 + Tailwind v4 (CSS-first `@theme`), Nunjucks, one `site.js`,
> data-driven nav, photos at their original `/assets/uploads/...` paths.
> New media and some copy will arrive later — the design must look complete with
> **existing assets only**, and degrade gracefully as better media replaces
> placeholders.

---

## 1. Design vision

**"A growing year, in a garden you're always welcome to join."**

Three principles, in priority order:

1. **Nature-aligned, not clip-art rustic.** Earthy, calm, seasonal. Texture and
   warmth come from real photography and a soil-to-sky palette — not from cartoon
   vegetables or busy backgrounds. Clean modern layout *grounded* by natural tone.
2. **Welcoming for any age.** The membership spans young families to retired
   gardeners. That means large, legible type; generous tap targets; plain
   British-English copy; obvious primary actions; and zero jargon without a
   plain-language gloss. Accessibility (WCAG 2.2 AA) is a design input, not a
   later audit.
3. **Photography-forward.** The association's strength is its photos (95 images
   across four sites, aerials, seasonal shots, "Lotti the cat"). The design frames
   them generously and lets them carry the emotional weight.

What we are **moving away from**: the current look is functionally clean but
generic — white background, centred prose columns, one flat green. It reads
"document", not "place". The redesign adds depth, season, and a sense of land.

---

## 2. Visual language

### 2.1 Colour — expand the palette (Tailwind `@theme` tokens)

Keep the existing brand greens; add a fuller natural range so sections can be
colour-blocked without looking corporate. All pairings below meet AA contrast for
body text; verify any new combination at build time.

| Token | Hex | Role |
| ----- | --- | ---- |
| `--color-brand-green` | `#5e9b2c` | Primary. Slightly deepened from `#6aa630` for AA on white at small sizes. |
| `--color-brand-green-light` | `#81c94c` | Accents, hovers, hairlines. |
| `--color-brand-green-deep` | `#2f5a1c` | **New.** Dark leaf — headings on cream, footer, deep sections. |
| `--color-brand-gold` | `#a88d2e` | Secondary accent (harvest), quotes, "leisure gardener" notes. |
| `--color-brand-soil` | `#6b4f3a` | **New.** Warm brown — captions, earthy dividers, icon strokes. |
| `--color-brand-sky` | `#cfe3ec` | **New.** Pale fen sky — alternate section wash. |
| `--color-brand-cream` | `#f6f3ea` | **New.** Paper/page background for alternating bands (replaces stark white). |
| `--color-brand-ink` | `#151e24` | Body text (unchanged). |

Usage rules:
- **Alternating section bands** drive the "growing year" rhythm: `white` →
  `brand-cream` → occasional `brand-green-deep` (inverted, white text) →
  `brand-sky`. Never more than one inverted dark band per scroll.
- Body text stays `brand-ink` on light, `white`/`white/90` on dark. Gold and
  light-green are **decorative only** — never body copy on white (fails AA).
- Replace the one-off inline `bg-[#e1fae7]` (About page) with `bg-brand-cream` or
  a green tint token.

### 2.2 Typography

Keep the brand pairing — it already fits: **Montserrat** (headings) + **Lora**
(body). Tune the scale up for readability across ages.

- Base body: **18px / 1.7** (up from default 16px) — comfortable for older
  readers; `max-width` ~68ch for prose.
- Fluid heading scale with `clamp()` so hero/H1 are bold on desktop without
  overwhelming mobile: H1 `clamp(2rem, 5vw, 3.5rem)`, H2 `clamp(1.5rem, 3vw,
  2.25rem)`.
- Headings: Montserrat 600–700, `tracking-wide` on display, `brand-green-deep`
  on light backgrounds.
- **Stop justifying body text.** Several pages use `text-justify` (About,
  History, Contact, Stores) — it creates rivers and hurts low-vision/dyslexic
  readers. Use left-aligned (`text-left`) throughout. Centre only short intros.
- Introduce a `.prose-page` refresh: larger lead paragraph (`text-xl` first
  paragraph per page), tighter list spacing, link underline offset for legibility.

### 2.3 Shape, depth & motif

- **Rounded, soft, organic.** Standardise on `rounded-2xl` for cards/media,
  `rounded-full` for pills/buttons. Soft shadows (`shadow-sm`/`shadow-md`), never
  hard borders as the primary divider.
- **Leaf/contour dividers.** Replace `<hr>` rules with a reusable SVG section
  divider — a subtle hand-drawn leaf-vine or fen-contour line in
  `brand-green-light`/`brand-soil`. One partial, used everywhere (see §4).
- **Seed-packet cards.** Site cards, info/resource cards and "how to apply" steps
  use a consistent card with optional top photo, a small line-icon, a heading and
  a short blurb. This is the workhorse component.
- **Line-icon set (inline SVG, no library).** A small kit — leaf, watering can,
  trowel, map-pin, calendar, seed, sun/season, cat 🐾 (for Lotti) — drawn at
  1.5–2px stroke in `brand-soil`/`brand-green`. Decorative icons get
  `aria-hidden="true"`.
- **Motion = gentle, optional.** Subtle fade/slide-in on scroll for cards, hover
  lift on cards/photos (already in the carousel). All wrapped so
  `motion-reduce:` disables it (the existing lightbox/carousel already respect
  reduced motion — keep that contract).

### 2.4 Imagery treatment

- Full-bleed hero images with a soft dark gradient scrim for legible overlaid
  text (the home hero already does this — extend the pattern to section/site
  page headers).
- Consistent aspect ratios per context (`aspect-[4/3]` cards, `aspect-video`
  embeds, `16/9` or `21/9` hero band).
- Every `<img>` keeps a meaningful `alt` (audit existing — several are `"Picture"`
  on About; fix). `loading="lazy"` everywhere below the fold (already done).
- Reserve **named media slots** (see §6) so incoming photos drop in without
  layout churn.

---

## 3. Information architecture & navigation

Current nav nests legal pages oddly (Privacy Notice & Rules under *Home*) and
hides *Apply for a plot* under *Contact*. Apply is the single most important
action on the site — it deserves prominence.

**Proposed top-level nav** (edit `src/_data/nav.json` only — never page markup):

```
Home
Our sites ▾   → Bridge Fen · Canterbury Avenue · New Barns · Upherds Lane
Grow & learn  (rename of "Info")
About ▾       → Our history · Stores
Contact
[ Apply for a plot ]   ← persistent primary button, visually distinct, far right
```

- **"Apply for a plot" becomes a button in the header**, not a buried submenu
  item, and repeats as the primary CTA on Home, Sites, and every site page.
- **Privacy Notice & Rules move to the footer** (where legal/governance links
  belong) and out of the Home submenu.
- **Stores** moves under *About* (it's an association service, not a top peer) —
  optional; keep top-level if the committee prefers.
- Rename **"Info" → "Grow & learn"** — friendlier, signals the page is for
  newcomers and families, not an admin dump.
- Footer grows to three small columns: *Explore* (key pages), *Governance*
  (Privacy, Rules, Tenancy Agreement), *Get involved* (Apply, Contact, Stores) +
  the copyright line and the "Ely in Cambridgeshire, not Cardiff" note.

Keep `aria-current` behaviour and the mobile hamburger. The header gains the CTA
button; ensure it stays usable at mobile widths (full-width button in the open
mobile menu).

---

## 4. Component library

One set of reusable Nunjucks partials/macros. New ones marked **NEW**.

| Component | File | Notes |
| --------- | ---- | ----- |
| Base layout | `_includes/layouts/base.njk` | Add a `heroless`/`pageHeader` hook; keep skip-link, lightbox markup, single script. |
| Header + nav | `partials/nav.njk` | Add persistent **Apply** CTA button; data-driven from `nav.json`. |
| Footer | `partials/footer.njk` | Three-column, data-driven; add governance + "not Cardiff" line. |
| **Page header band** **NEW** | `partials/page-header.njk` | Reusable title band with optional background photo + scrim + lead text. Replaces the bare `<h1>` opening every interior page. |
| **Section divider** **NEW** | `partials/divider.njk` | Inline SVG leaf/contour rule; replaces `<hr>`. |
| **Card** **NEW** | `partials/card.njk` (macro) | Seed-packet card: image?, icon?, title, body, optional link/CTA. Powers site grid, resources, apply steps. |
| **CTA button** **NEW** | macro or utility class set | Primary (`bg-brand-green`), secondary (outline), used for Apply/PDF/contact. Standardise the three different button styles currently in use. |
| **Stat / fact chip** **NEW** | small macro | e.g. "100+ plots", "Est. 1991", "5 sites" — friendly facts on Home/Sites. |
| Carousel | `partials/carousel.njk` | Keep as-is (pure CSS scroll-snap + JS enhancement + lightbox). Restyle dots/arrows to new palette; add optional caption styling. |
| **Callout / note** **NEW** | small macro | For tips, "what's a pole?", seasonal notes, form-pending notices. Soft tinted box with icon. |
| Map embed | inline pattern | Standardise height + `rounded-2xl`; wrap with a small "open in Google Maps" text link for accessibility. |
| Form embed | inline pattern | Standardise responsive iframe + the "form being set up" fallback (already exists). |
| **Seasonal banner** **NEW** | `partials/season.njk` + `_data/season.js` | Computes current season from build date; drives the Home seasonal note (see §5.1 & §7). |

All decorative SVG carries `aria-hidden`; all interactive controls keep visible
focus rings (`focus-visible:` styles) tuned to the new palette.

---

## 5. Page-by-page redesign

Content is **preserved** — every page keeps its text, links and photos. These are
layout/styling changes plus the corrections in §6.

### 5.1 Home (`index.njk`)
- **Hero**: keep full-bleed photo + gradient; enlarge wordmark, add a one-line
  strapline ("Allotment gardens for rent to the residents of Ely, Cambridgeshire")
  and **two CTAs**: primary *Apply for a plot*, secondary *Explore our sites*.
- **Welcome band** (cream): the intro paragraph as a lead, plus 3–4 **fact chips**
  (Est. 1991 · ~5 sites · 200+ members · run by volunteers). Keep the "not Cardiff"
  note as a small callout.
- **Sites preview**: 4 seed-packet cards linking to each site (photo + name +
  one-line descriptor pulled from the Sites page).
- **Seasonal thought** (gold-accent): keep the Carse quote, but make the heading
  **dynamic** — "A seasonal thought for {{ season }}" computed at build (currently
  hard-coded "…in readiness for winter", which is wrong in summer; see §6.7).
- **Featured photo** (Pete's plot) retained; add a "More from our sites →" link.
- Keep the "painting by Nancy Voak" credit but attach it correctly to the hero/
  intro image it refers to (currently floats above the heading with no adjacent
  image — clarify or move beside the relevant artwork).

### 5.2 Sites hub (`sites.njk`)
- Page-header band with an aerial photo.
- **Site cards grid** (the four sites) as seed-packet cards with photo, name,
  tenant count chip, and one-line descriptor → link to detail page. Replaces the
  current bare image grid + separate text blocks (merge them).
- **Rents table**: restyle as a clean zebra/responsive table with the new palette;
  on mobile, collapse to stacked rows. Keep all six bands and the pensioner
  column. Add the "what's a pole?" callout linking to the **fixed** anchor (§6.1).
- Resolve the **"five sites"** wording (§6.2).
- Persistent Apply CTA at the foot.

### 5.3 Site detail pages (Bridge Fen, Canterbury Avenue, New Barns, Upherds Lane)
- Consistent template: **page-header band** (site name + map-pin + one-line
  descriptor) → map → description → galleries/carousels → site-specific extras
  (Bridge Fen paintings & blog; New Barns videos & Lotti; Upherds aerials & site
  plan PDF).
- Standardise map height/rounding and add an "Open in Google Maps" text link.
- Carousels restyled to new palette; keep two-carousel splits where they exist.
- Move the inline Canterbury photos into the standard figure/card treatment.
- Keep the "marker position indicative only" note as a small caption, not body
  text.

### 5.4 Grow & learn (`info.njk`, renamed)
The current page is a long "miscellany". Re-section it into clearly-titled,
card-anchored blocks with a small in-page table of contents:
- **Getting started** (RHS beginners guide, "how much time?", vertical gardening).
- **On your plot** (Tenancy Agreement download CTA, rodent control + PDF, the
  "gardening = full-body workout" graphic).
- **Curiosities** ("What's a pole?" — give the section the `id="polemeasure"` that
  other pages link to, §6.1).
- **Useful links** (the external links list, as tidy cards or a styled list).
- Each download is a standardised **PDF CTA button** with a doc icon and file note.

### 5.5 About + History
- **About**: fix the `alt="Picture"` images; replace inline `bg-[#e1fae7]` with a
  palette token; lay out as photo + text with the "25 years" article as a
  highlighted card (doc icon + download CTA).
- **History**: keep the full "potted history" prose. **Self-host** the history PDF
  (currently links to the live absolute URL; see §6.3) or remove the dead-ended
  link. Consider a short **timeline strip** (1908 Acts → 1982 protest → 1991
  founded → 2016 25th anniversary → 2018 merger with Horticultural Society → 2025
  FCA co-operative) built from the About + History + 25-years PDF facts — a
  friendly, age-spanning device. Cross-checked against the *25 years* PDF (§6.4).

### 5.6 Contact & Apply
- **Apply** is the flagship: page-header band, a **3-step "How it works"** card row
  (1 Read the Tenancy Agreement · 2 Submit the form · 3 We confirm your place),
  the eligibility/parish note as a callout, then the embedded Google Form.
  Make the **"As at June 2025…" availability note dynamic or clearly dated** (§6.5).
- **Contact**: restyle; keep the form + fallback. Surface the secretary email
  (`secretary@elyallotmentsandgardens.org`) as a visible alternative contact.

### 5.7 Stores
- Restyle address/hours/map into a clean two-column "info + map" card.
- Keep the leisure-gardener £5 note as a highlighted callout.
- Keep the enquiries/orders form (currently shares the contact form embed).

### 5.8 Privacy Notice & Rules
- Move to footer nav. Restyle as clean legal/prose pages with a clear "Download
  PDF" CTA. Fix "Kings seed scheme" → "Kings Seeds scheme" (§6.6). Confirm the
  privacy text matches the PDF (it does, verified) and reflects the
  Google-embed/Maps reality post-migration (MIGRATION Phase 6 note).

---

## 6. Content corrections & updates

Found by cross-reading the pages against each other and the source PDFs
(`/assets/documents/*.pdf`). Each is small; group them into one content pass.

1. **Broken in-page anchor `#polemeasure`.** `sites.njk:165` and `new-barns.njk:17`
   link to `/info/#polemeasure`, but the "What is a pole?" heading in `info.njk`
   has **no `id`**. Add `id="polemeasure"`. (The tenancy anchor `#tenancyagreement`
   and `#rents` are fine.) — *bug, fix.*
2. **"Five sites" vs four shown.** `sites.njk:12` and `history.njk:36` say the
   Association runs **five** sites, but only four have pages/cards (Bridge Fen,
   Canterbury Avenue, New Barns, Upherds Lane). Confirm with the committee whether
   a fifth site exists (and needs a page) or the count should read "four". —
   *verify.*
3. **History PDF link is off-site / possibly dead.** `history.njk:50` links to
   `https://www.elyallotmentsandgardens.org/assets/uploads/ely_allotments_association__history.pdf`,
   which was never in the export (MIGRATION note). Either self-host a copy under
   `/assets/documents/` or drop the link. — *fix.*
4. **"25 years" article cross-check.** The on-page History byline is *Graham Bond,
   Chair, February 2018*; the downloadable *25 years* article
   (`ely_allotments_association_25_years.pdf`) is a **different, earlier** piece
   (*November 2016*, written for the 25th-anniversary awards evening). They're
   consistent in facts but distinct documents — keep both, but label the download
   clearly as "the 2016 anniversary article" so they aren't confused. — *clarify.*
5. **Dated availability copy.** `apply-for-a-plot.njk:32` "As at June 2025 there
   are no long term vacant plots…" is now over a year old. Make this a clearly
   dated, easily-editable callout (ideally a single value in `_data`), or refresh
   it. Same pattern for the rents "2025/26 … agreed March 2025 AGM" line on Sites —
   centralise the year so the annual update is one edit. — *update + future-proof.*
6. **"Kings seed scheme" → "Kings Seeds scheme"** (`privacy-notice.njk:46`) — minor
   British-English/proper-noun fix.
7. **Hard-coded season.** Home's "A seasonal thought in readiness for winter" is
   wrong outside autumn/winter (today is June). Drive the season label from the
   build date via a `season.js` data file (§7). — *fix.*
8. **`alt="Picture"` placeholders** on About (and check others) — replace with
   descriptive alt text for accessibility/SEO.
9. **Justified text** on About/History/Contact/Stores — switch to left-aligned
   (readability/accessibility). — *style, but content-adjacent.*
10. **Empty `site.email`.** `site.json` has `"email": ""` while the secretary
    address is used in Privacy. Populate `site.email` (or a `site.contact` block)
    and reference it from templates so it lives in one place.
11. **Tenant counts**: Sites/Upherds say "45", the 2016 PDF said "43 families" —
    fine (numbers drift), but confirm current figures when the committee next
    updates content; consider sourcing site facts from `_data` so they're edited
    in one place, not across multiple pages.
12. **Pending Google Forms.** Contact + Stores still show the "form being set up"
    fallback (`site.forms.contactEmbedSrc` empty). Track as launch-blocker
    (already in MIGRATION Phase 5) — design must keep the graceful fallback.

PDFs reviewed: tenancy agreement, 25-years article, privacy notice, rodent
control, NAS model rules, Upherds plan. The privacy-notice page text matches its
PDF; the tenancy/rules/rodent PDFs are referenced correctly. No content
contradictions beyond the above.

---

## 7. Data & technical notes (within existing constraints)

- **New `@theme` tokens** (§2.1) added to `src/css/main.css`. No
  `tailwind.config.js` — stay CSS-first. Re-check the `@source` globs still cover
  any classes only referenced from `site.js`.
- **Site facts in `_data`.** Add `src/_data/sites.json` (name, slug, short
  descriptor, tenant count, soil, water, parking, map coords, hero image) so the
  Sites hub cards, site headers, and Home preview all read from one source. Reduces
  the cross-page drift in §6.
- **Seasonal label**: `src/_data/season.js` (ESM) exports a season string from the
  build month. Used by Home and any seasonal banner. Pure build-time — no client
  JS, no `Date.now()` in templates beyond the data file. Rebuild monthly (or on
  deploy) refreshes it; document this cadence.
- **Editable notices in `_data`**: availability text (§6.5), current rent year,
  AGM date → `src/_data/notices.json`, surfaced via templates. One-line edits for
  volunteers.
- **One script only.** All new interactivity (scroll-reveal, seasonal nothing-
  client-side) stays progressive enhancement in `src/js/site.js`. Prefer CSS
  (`@starting-style`, scroll-driven where supported) over JS; never add a
  framework. Respect `prefers-reduced-motion` (the carousel/lightbox already do).
- **Icons/dividers** are inline SVG partials — no icon font, no sprite dependency,
  no external requests.
- **Performance budget**: photography-forward design must stay fast. Specify
  responsive `srcset`/`sizes` and width/height on images (consider the Eleventy
  Image plugin in a later pass — optional, currently passthrough-copied). Keep
  Google Fonts preconnect; consider self-hosting Lora/Montserrat to cut third-party
  requests and improve privacy (aligns with the post-Weebly privacy clean-up).
- **Accessibility acceptance**: AA contrast on every text/background pair; visible
  focus on all controls; landmarks (`<header>/<nav>/<main>/<footer>`) intact; alt
  text on all images; forms/maps have titles (already present); 200% zoom and
  keyboard-only navigation verified.

---

## 8. Suggested delivery phases

1. **Foundations** — palette tokens, typography scale, button/card/divider/
   page-header partials, footer + nav restructure (incl. Apply CTA). No page
   content changes yet; build a small component preview page to sign off the look.
2. **Content corrections** (§6) — fast, low-risk, can land independently of the
   restyle (fix anchors, season, alt text, justify, off-site PDF, copy fixes,
   `_data` for sites/notices).
3. **Home + Sites hub** — highest-traffic, sets the tone.
4. **Site detail pages** — apply the shared template; restyle carousels/maps.
5. **Grow & learn + About/History** — re-section, timeline strip.
6. **Apply/Contact/Stores + legal** — CTA flow, form embeds, footer legal pages.
7. **Media swap & polish** — drop in new photos/copy into the named slots (§6),
   responsive images, optional self-hosted fonts, final a11y + Lighthouse pass.

Each phase ends with `npm run build` + visual check; keep MIGRATION.md/this file
ticking off as sections land.

---

## 9. Open questions for the committee

- **Five vs four sites** — is there a fifth site needing a page? (§6.2)
- **Brand artwork** — can we use Nancy Voak's paintings more prominently (hero/
  about), and is the attribution wording fixed?
- **New media** — what's arriving (fresh site photos, drone, a logo/wordmark
  asset, headshots)? The design reserves slots; confirm formats/aspect ratios.
- **Tone of copy** — appetite for lightly rewriting the longer prose (Info/
  History) into shorter, more welcoming chunks, or strictly preserve as-is?
- **Self-hosting fonts & history PDF** — approve for privacy/performance?
- **Seasonal feature** — keep the literary quote, or rotate seasonal "what to do
  now" tips (more useful to newcomers)?
