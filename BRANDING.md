# Sappho & her beans — Branding Guide (for coding agents)

This is a distilled, **actionable** summary of the official _"Sappho Brand Guidelines
v1 (2.9.24)"_ PDF, written so a coding agent can apply the brand correctly without
opening the PDF. If you touch anything visual (colors, fonts, spacing, components),
follow this document.

> Source of truth: `Sappho Brand Guidelines v1 2.9.24.pdf` (kept locally, not committed).
> If this doc and the PDF ever disagree, the PDF wins — update this doc to match.

---

## 1. Brand snapshot

- **Who:** Sappho & her beans — a specialty coffee roaster focused on relational /
  direct-trade coffee.
- **Aesthetic:** light, warm, and **pink-forward** with a strong **deep-navy** anchor.
  Clean, airy, modern, feminine-but-confident. The site should feel bright (light
  color scheme), never dark-mode by default.
- **Feel in one line:** _"Unique coffee AND uncompromised quality."_

---

## 2. Color palette (official)

| Name              | Hex         | Role in guidelines                   |
| ----------------- | ----------- | ------------------------------------ |
| **Deep Navy**     | `#001F36`   | Primary (text, headings, dark UI)    |
| **Pink**          | `#F8DCDF`   | Primary (brand background / surface) |
| **Peach**         | `#EFAA9C`   | Secondary                            |
| **Sunset Orange** | `#997C60` † | Secondary (accent/highlight)         |
| **Peachy Pink**   | `#E8ABB0`   | Secondary                            |
| **Winter Frost**  | `#FAF9F8`   | Secondary (near-white background)    |

† **Known discrepancy:** the PDF prints "Sunset Orange `#997C60`", but that hex is a
muted tan and the swatch shown is a vivid orange. The current implementation uses a
saturated orange (`#e87a01`) to match the swatch. Confirm the intended value with the
brand owner before relying on it. Do **not** silently "fix" it either way.

### How the palette maps to the code (Natcore v2 theme)

The storefront uses the **Natcore Design System v2** (CSS-first, Tailwind v4). The brand
palette is declared as anchor tokens in
[`apps/ecommerce/src/styles/globals.css`](apps/ecommerce/src/styles/globals.css) inside a
`@theme static { … }` block; Natcore derives the full `50–950` ramp from these anchors.

```css
@theme static {
  --theme-primary: #001f36; /* Deep Navy   */
  --theme-secondary: #e87a01; /* Sunset Orange (see discrepancy note) */
  --theme-accent: #e8abb0; /* Peachy Pink */

  --theme-surface-50: #fef7f8; /* near-white blush */
  --theme-surface-500: #f7dcdf; /* brand Pink       */
  --theme-surface-950: #001f36; /* Deep Navy        */

  --theme-danger: #c0445f;
  --theme-success: #2f8f6b;
}
```

**Use tokens, not raw hex.** Prefer Natcore/Tailwind token classes so the brand stays
consistent and themeable:

- Backgrounds: `bg-primary-500`, `bg-surface-50`, `bg-secondary-500`, `bg-accent-500`, …
- Text: `text-on-primary-500`, `text-on-surface-50`, `text-primary-700`, …
- Borders: `border-surface-800`, `border-primary-300`, …
- Palette context: `palette-surface`, `palette-primary` (sets the inherited palette).

Avoid hardcoded hex like `bg-[#F7DCDF]`; use `bg-surface-500` instead. (A few legacy
hardcoded pinks remain and may be migrated over time.)

---

## 3. Typography (official + free substitutes)

The brand fonts are commercial. Per project direction we use the **closest free
(Google Fonts) substitute** for each, wired through `next/font`.

| Role                  | Brand font         | Free substitute (in use)                | Where it's used                                       |
| --------------------- | ------------------ | --------------------------------------- | ----------------------------------------------------- |
| **Primary**           | Baron              | **Montserrat**                          | Headings / display (`h1`–`h6`, `.font-primary`)       |
| **Secondary**         | Canva Sans         | **Noto Sans**                           | Body text (site default)                              |
| **Tertiary**          | Antic              | **Antic** (free — no substitute needed) | Accent text (`.font-tertiary`)                        |
| Product-label display | _(project choice)_ | **MedievalSharp**                       | Stylized product-card labels (`BrandingStylizedFont`) |

### How fonts are implemented

- Fonts are declared in [`apps/ecommerce/src/app/fonts.ts`](apps/ecommerce/src/app/fonts.ts)
  via `next/font/google`, each exposing a CSS variable
  (`--font-primary`, `--font-secondary`, `--font-tertiary`).
- Those variables are applied on `<html>` in
  [`apps/ecommerce/src/app/layout.tsx`](apps/ecommerce/src/app/layout.tsx).
- They are mapped to elements/utilities in
  [`apps/ecommerce/src/styles/globals.css`](apps/ecommerce/src/styles/globals.css)
  (`body` → secondary; headings + `.font-primary` → primary; `.font-secondary`,
  `.font-tertiary` utilities).
- `BrandingStylizedFont` (MedievalSharp) is **not** a CSS variable — it's applied
  directly via `BrandingStylizedFont.className` in
  [`apps/ecommerce/src/app/_components/product-card.tsx`](apps/ecommerce/src/app/_components/product-card.tsx).

**To change a substitute font:** update the import + config in `fonts.ts`; if it's
primary/secondary/tertiary the CSS variable wiring carries it automatically. Keep the
`variable:` names stable.

---

## 4. Rules for agents (do / don't)

- **Do** keep the light color scheme. `:root { color-scheme: light }` is pinned in
  `globals.css` so the brand's pink/light look survives OS dark mode. Don't remove it.
- **Do** use Natcore v2 component + token classes (`btn-solid/primary`,
  `card-soft/surface`, `divider/secondary`, `text-on-*`, `bg-*-500`). There is **no**
  bare `.btn` / `.card` in v2.
- **Do** use the palette/typography tokens above rather than inventing new colors/fonts.
- **Don't** commit the brand-guidelines PDF or any licensed/commercial font files.
- **Don't** switch the substitute fonts to the licensed originals (Baron, Canva Sans)
  unless the project obtains a license.
- **Don't** resolve the Sunset Orange hex discrepancy without brand-owner confirmation.
- **Scope:** this branding applies to `apps/ecommerce` (the storefront). The `apps/admin`
  app intentionally still uses Natcore **v1** and is not part of this brand system yet.

---

## 5. Key files reference

| Concern                                     | File                                                  |
| ------------------------------------------- | ----------------------------------------------------- |
| Brand palette + font mapping + light scheme | `apps/ecommerce/src/styles/globals.css`               |
| Font declarations (`next/font`)             | `apps/ecommerce/src/app/fonts.ts`                     |
| Font CSS vars applied to `<html>`           | `apps/ecommerce/src/app/layout.tsx`                   |
| Stylized product label font usage           | `apps/ecommerce/src/app/_components/product-card.tsx` |
| Tailwind v4 / Natcore v2 PostCSS setup      | `apps/ecommerce/postcss.config.mjs`                   |
