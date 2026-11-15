# Premium Design Spec (mandatory)

The whole site must look like a product from a well-funded infrastructure company, not a student template.
Premium here means: restraint, precise spacing, consistent details, and one memorable moment.
Where this file conflicts with `DESIGN.md`, this file wins.
**Exception:** `3D_EXPERIENCE.md` overrides section 3 below (the single memorable moment) and the Lighthouse/JS budgets in section 8. The 3D scenes are the site's signature; the rest of the UI stays calm.

## 1. Design plan

**Subject:** a DevOps engineer's portfolio that behaves like a live production system.
**Audience:** recruiters and engineering managers skimming in 30 seconds, then engineers who dig in.
**Primary job:** prove the person ships and operates real systems, fast.
**Concept: "Control room at night."** A calm, dark, precisely lit interface. Surfaces are layered graphite,
information is carried by thin lines and small indicator lights, and everything that looks live is live.

### Color (named tokens; defined in `frontend/src/styles/tokens.css`)
| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0A0E14` | Page background (a cool blue-black, not pure black) |
| `--panel` | `#111821` | Cards, terminal, tables |
| `--panel-raised` | `#18212D` | Hover, modals, inspect panel |
| `--line` | `#253246` | 1px borders and dividers |
| `--text` | `#E8EEF6` | Primary text |
| `--text-muted` | `#8C9BB0` | Secondary text |
| `--accent` | `#7CC4FF` | Links, focus ring, active nav, cursor |
| `--ok` | `#34D3A1` | Healthy / success |
| `--warn` | `#F5B544` | Deploying / in progress |
| `--fail` | `#FF6B7A` | Failing / error |

Light theme: invert surfaces to a cool paper white (`#F5F7FA`) with the same accent hue darkened for contrast.
Use accent sparingly: at most one accent-colored element per viewport besides links.
Status colors are only for status, never decoration. Always pair with an icon or text label.

### Typography
- **Headings:** Bricolage Grotesque (weights 600 to 800), tight tracking (-0.02em), sentence case.
- **Body/UI:** Instrument Sans (400, 500, 600).
- **Terminal, digests, code, numbers in tables:** JetBrains Mono (400, 500) only where the content is literally machine output.
- Self-host with `@fontsource/*` packages (or `@fontsource-variable`) and `font-display: swap`; preload the two most used files.
- Fluid scale with `clamp()`: base 16px body, 1.2 ratio, headings up to about 64px on desktop for the hero only.
- Body line length at most 70 characters, line-height 1.6 body and 1.1 for large headings.
- Do not use ALL CAPS labels, tracked-out eyebrows above every heading, or "→" appended to links and buttons.
  Use sentence case everywhere. Table headers in the registry are lowercase mono to mimic the CLI.

### Shape, depth, spacing
- 4px spacing base (4, 8, 12, 16, 24, 32, 48, 64, 96).
- Radius scale with meaning: 6px for inputs and badges, 12px for cards and panels, 999px for status dots and pills only.
- Depth from borders and layered surfaces, not heavy shadows. One soft shadow token for modals only.
- A faint 1px inner top highlight (`inset 0 1px 0 rgba(255,255,255,.04)`) on panels gives a machined-metal feel.
- A very subtle noise or grid texture on the page background at 3 to 4 percent opacity; never behind text blocks.

## 2. Layout concept

Left-aligned throughout, 12-column grid, content max-width 1200px, generous vertical rhythm (96px between major blocks on desktop).

```
HOME (desktop)
+------------------------------------------------------------------+
| status bar: name        projects  registry  pipeline  status  ... |
+------------------------------------------------------------------+
|                                                                  |
|  Headline (what you do, one line)        +----------------------+ |
|  Short supporting sentence               |  release card (live) | |
|  [View projects] [Skip to resume]        |  v1.4.2  healthy     | |
|                                          |  deployed 2h ago     | |
|  +--------------------------------+      |  commit a1b2c3d      | |
|  | terminal (boots, then idle)    |      |  uptime 99.9%        | |
|  | $ _                            |      +----------------------+ |
|  +--------------------------------+                              |
+------------------------------------------------------------------+
```

Mobile: single column; release card first as a compact strip, then headline, then terminal (full width), nav collapses to a bottom sheet menu.

## 3. The one memorable moment

**The boot-to-live sequence on the home page.** On first visit only (skippable, remembered), the terminal runs a short
real-looking deploy: it "pulls" the image, runs health checks, and flips the release card from `deploying` (amber)
to `healthy` (green) while the headline settles into place. Total about 2.5 seconds. After that the page is static and calm.
Returning visitors and `prefers-reduced-motion` users see the final state instantly.

Everything else is quiet. No scroll-triggered fade-up on every section, no hover-lift on every card.

## 4. Component standards

- **Status bar (nav):** 56px, translucent panel with backdrop blur, bottom hairline, active item has accent underline 2px.
  Right side: theme toggle, live health dot with tooltip ("All systems healthy, checked 12s ago").
- **Buttons:** primary = accent fill with dark text; secondary = transparent with `--line` border. 44px min height, 150ms transitions
  on background and border only.
- **Cards:** panel fill, 1px line, 12px radius, 24px padding. Hover only changes border color. Vary card sizes by content
  importance; do not render everything as identical tiles.
- **Badges:** pill with small status dot and text (`healthy`, `deploying`, `failing`, `verified`). Dot can pulse slowly only for `deploying`.
- **Terminal:** panel with a slim title bar (three neutral dots are not required), mono 14px, accent block cursor, selectable text,
  prompt `visitor@portfolio:~$`. Output lines animate with a quick typewriter only during boot; later outputs appear instantly.
- **Registry table:** sticky lowercase mono header, row hover highlight, zebra off, digest cells truncated with copy button and toast "Credential ID copied".
  Pull opens a modal with focus trap; Inspect opens a right-side drawer (full-screen sheet on mobile).
- **Pipeline view:** horizontal stage chips connected by a 1px line; running stage has a moving highlight; failed stage shows the log excerpt on expand.
- **Skills panel:** thin 6px bars with the status pill; animate bar fill once on first view only.
- **Timeline (release notes):** a vertical line with version nodes; major versions get a larger node. Only here are numbered/version markers
  appropriate because the content is a sequence.
- **Toasts, empty states, errors:** plain language that says what happened and what to do. Example empty state for certificates:
  "No credentials added yet. Add one to `registry.json` and push to deploy it."

## 5. Page-by-page finish

| Page | Premium treatment |
|---|---|
| `/` | Boot-to-live sequence, release card, headline, terminal; below the fold: three featured projects (varied sizes) and a compact skills strip |
| `/projects` | Service cards with health dot, stack chips, expandable postmortem (animated height, answers the click) |
| `/registry` | The signature section; full spec in `CERTIFICATES_SECTION.md`, polished table, drawer, pipeline chips, release timeline, skills health |
| `/pipeline` | Latest run summary strip, stage chips, run history list with durations and commit links |
| `/status` | Overall banner ("All systems operational"), per-service rows with 30-day uptime bars (30 small bars each), latency sparkline in SVG |
| `/architecture` | Hand-built SVG diagram on the grid, boxes link to repo files, hover highlights the data path |
| `/chaos` | One large control, a safe-sandbox notice, a live event timeline (failure, alert, recovery, rollback) with timestamps |
| `/resume` | Print-optimized (A4), clean single column, download button, no decoration |

## 6. Motion rules
- Durations 120 to 200ms for UI feedback, up to 400ms for panels/drawers; easing `cubic-bezier(.2,.8,.2,1)`.
- Only animate `opacity` and `transform` (plus height for expanding postmortems).
- Motion must answer an action (open, expand, copy, run) except the single boot sequence.
- Respect `prefers-reduced-motion: reduce` by disabling all non-essential motion.

## 7. Copywriting
- Plain, specific, sentence case, active voice. Buttons say what happens: "View projects", "Download resume", "Copy credential ID".
- No filler like "Welcome to my portfolio". Headline example: "I build and ship systems that stay up." (replace with the user's own words from `profile.json`).
- Errors and empty states explain the problem and the fix; no apologies.
- Do not write fake statistics. Any number on screen comes from data or a real API; otherwise label it "sample data".

## 8. Quality bar (must pass before calling it finished)
- [ ] Lighthouse: performance 90+ desktop (75+ mobile with 3D), accessibility 95+, best practices 95+, SEO 90+
- [ ] Verified at 360px, 768px, 1024px, 1440px widths; no horizontal scroll
- [ ] Keyboard-only walkthrough works; visible focus ring (2px accent, 2px offset) everywhere
- [ ] Contrast AA in both themes; status never conveyed by color alone
- [ ] Layout shift under 0.05 (fonts preloaded, image dimensions set)
- [ ] Open Graph image and favicon set; title and meta description per route
- [ ] 404 page and error boundary styled to match
- [ ] No console errors or warnings in production build
- [ ] Self-review: remove one decorative element from each page before finishing
