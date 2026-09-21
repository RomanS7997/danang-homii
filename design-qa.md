# Design QA — balanced typography, 2026-09-21

**final result: passed**

Source: deployed revision `4ea9634`; user approved the SF/Inter family but requested a less oversized scale. Latest rules supersede the large-type values in historical reports below.

- **P2, fixed — oversized hierarchy and mobile wrapping.** Section headings reduced from up to 50 px to 42 px; mobile hero from approximately 34 px to 30 px at 390 px. The Russian hero now takes three lines instead of four. Card titles are 18 px/600; metadata and image badges 14 px. Form headings reduced to 24–26 px; mobile dialog headings to 27 px. Body copy remains 16–17 px and inputs 16 px. Compact controls retain usable hit areas and slate contrast.
- **P2, fixed — form row alignment.** A wrapped date label displaced its field relative to the budget field. The row now aligns controls along their bottom edge; native input top edges differ by only 2 px. Rechecked the rendered desktop form after the fix.
- **Typography:** same SF/Inter family, weight hierarchy softened, no return to 9–12 px body copy. Latin, Cyrillic and Vietnamese accents inspected. Apple-device rendering was not independently tested.
- **Layout:** hero photo gains space as heading height decreases; photo/map relationship, page order, CTA position and responsive grids are retained. More compact caption and footer; no clipping or horizontal overflow in checked 320/390/1366 px views.
- **Colour, imagery and content:** existing ivory/navy and champagne/blue gradients, generated imagery, transparent logo and copy remain unchanged. No asset substitutions or new visual effects.

Comparison evidence: `work/type-balance-qa/before-desktop.png` and `after-desktop.png`, captured at 1366 × 900 CSS pixels; both exported rasters 1351 × 890. Mobile pair `before-mobile.png` / `after-mobile.png` at 390 × 844 CSS pixels; both rasters 375 × 812. Files contain JPEG bytes from the browser despite local .png names; no resize or density normalization was applied. Both pairs were opened together in the same comparison input. State: RU, gradient variant 2, seaside selected, map open, page top. The first desktop capture during resize was discarded and replaced with the settled map. Full-view comparison also covered heading and caption regions; separate crops were unnecessary for this typography-only adjustment.

Final copies: `docs/screenshots/balanced-typography-desktop.jpg` and `docs/screenshots/balanced-typography-mobile.jpg`. Additional local evidence: `work/type-balance-qa/form-mobile.png`.

Checked RU homepage and lead form on desktop/mobile; VI homepage, property page and viewing dialog at 320 px; EN catalogue and footer at 320 px. Language switching and viewing dialog opening/closing work. No browser console errors. Root/Pages builds and all 10 existing tests pass. No unresolved P0/P1/P2 findings in scope.

---

# Design QA — readable SF/Inter typography, 2026-09-21

**final result: passed (local visual and build verification)**

Scope: user-requested larger type throughout the existing site and SF Pro Display appearance, including headings. Previous typography decisions in the historical reports below are superseded by this section.

- Native SF font stack on Apple; locally bundled Inter Variable elsewhere. Apple font files are not shipped. Visual verification was performed on Windows with Inter, not on an Apple device.
- Body text is 17–18 px; navigation, fields and buttons 16 px; form labels 15 px; secondary notes 14–15 px. Short uppercase section labels remain 12 px and map attribution 11 px. Muted body copy uses darker slate. Font sizes stay readable at mobile breakpoints.
- Layout changes accommodate the larger type: wrapping filter bars and card metadata, two-column room choices, single-column mobile process cards, expanded hero space, and two-column mobile footer links. Area and unit stay together with a nonbreaking space.
- Fixed P2: the enlarged mobile view switch collided with the slide counter. Redundant counter is hidden on phones. Fixed remaining 12 px explanatory text in dialogs, FAQ and inner-page content.
- Compared the old deployed homepage and new render together at matching 1366 × 900 and 390 × 844 CSS viewports. Photo/map layout, gradient palette, artwork and copy remain consistent; larger sans-serif headings are the intentional change. Mobile baseline includes the map loading below the fold; comparison concerns typography and layout, not motion timing.
- Visually inspected RU homepage top, map, apartment cards, form and footer; EN catalogue and owner page; VI property page, viewing dialog, owner form, guides and article. Sizes: 320 × 780, 390 × 844, 1280 × 720 and 1366 × 900. No horizontal overflow in checked views. Vietnamese accents and Cyrillic render correctly.
- Interactions: language switch retains page, catalogue Studio filter returns one apartment, map Studio selection updates the photo and selected state, viewing dialog opens/closes. No browser console errors observed.
- Root and Pages builds pass. Translation tests 3/3, Sites tests 4/4, Pages tests 3/3. Existing map-library bundle-size advisory remains.

Evidence: local `work/typography-qa/` stores matched before/after hero captures and mobile form/footer captures. Representative final captures are included in `docs/screenshots/typography-desktop.png` and `docs/screenshots/typography-mobile.png`.

No unresolved P0/P1/P2 issue remains in the typography scope. Backend/demo limitations are unchanged. Apple-device font rendering was not physically tested.

---

# GitHub Pages preparation — 2026-09-21

**final result: passed — deployed and verified**

Root build and Pages build pass. Tests: 3 translation, 4 Sites worker and 3 Pages checks pass. All 42 locale routes have physical HTML entry points; generated HTML/CSS use the repository base and resolve existing assets. Root-deployment compatibility is preserved.

Public URL: https://romans7997.github.io/danang-homii/. Initial source revision: `affe01d`. [Build and deploy run](https://github.com/RomanS7997/danang-homii/actions/runs/35573483884) succeeded. Live HTTP checks returned 200 for all 46 requests: root, 42 localized page entry points, apartment photo, logo and local map style. Browser checks confirmed rendered imagery, ready vector basemap, all four prices, studio selection updating the photo, apartment deep-link reload and EN/VI switching while retaining the property. Vietnamese direct-page reload rendered the correct heading. No browser console errors were observed.

The historical `local-review/` and `preview/` paths below describe local review artifacts, not files required to build the site. Two representative screenshots are included in `docs/screenshots/`.

---

# Design QA — map entrance, 2026-09-21

**final result: passed**

Scope: strengthen the homepage map and price entrance while preserving the approved final composition, imagery, typography and palette.

- Fixed the root cause: price keyframes previously ran while their parent map was hidden. Entrances now wait for the panel, basemap readiness and first viewport intersection.
- Full photograph holds briefly, then the map opens over 1280 ms with a scale/position settle. Prices start near the end of that opening, land with a small overshoot and are staggered by 160 ms. The selected price gets a short ring; even the last marker's ring fits inside the entrance phase.
- Actual frame sampling confirms waiting -> entering -> shown. Around 1.6 s, the first price was at 0.80 opacity, the second at 0.20 and the other two at zero; by 3.0 s all four were settled.
- Replay resets to the full photo before opening. Manual Photo cancels the pending automatic reveal and remained closed in a later check. Returning from the catalogue starts a fresh introduction.
- Selection updates existing buttons, colours and z-order. Studio/family clicks changed the photo/price and retained button focus without restarting other prices. Full map modal showed all four prices without intro keyframes.
- Checked 1647 x 912 desktop, 1366 x 768 laptop and 390 x 844 mobile. No horizontal overflow. All four marker centres remained clickable on laptop/mobile; mobile apartment CTA remains between photo and map.
- English/Vietnamese switching retained the selected apartment and usable markers. Variant 3 also loaded and settled with four prices.
- Reduced-motion branch and CSS reviewed: immediate open/settle, no price keyframes, ring or photo scale. Browser-level emulation was unavailable in this test surface; OS motion settings were not changed.
- Console errors: none. Production build, 3 i18n tests and 4 Sites tests pass. Existing large map-library chunk advisory remains.

Evidence: `preview/map-motion/` in the handoff, also `local-review/work/map-motion-qa/`. Timeline JSON and individual frames record the actual sequence. Desktop final and `work/multipage-qa/home-ru-desktop.png` were opened together at identical dimensions. Typography, layout, colour, imagery and copy retain the approved stable composition; only motion is intentionally changed.

No unresolved P0/P1/P2 issue remains in this scoped change. No publication or backend integration performed. Previous source is backed up in `work/before-map-motion/`.

---

# Design QA — multilingual multi-page v1, 2026-09-21

**final result: passed**

Scope: complete the initial frontend with additional pages and switchable Russian, English and Vietnamese. Preserve the approved Homii homepage, gradient artwork, home-and-wave logo and linked map/photo behaviour. New pages are extensions of that selected visual system, not copies of unseen mockups. Live inventory and delivery of requests were not requested or implemented.

## Findings and fixes

- **P2, fixed — owner form widened the 320 px page.** Initial RU/EN owner pages had a 315 px document width against a 305 px content viewport. A non-wrapping submit button imposed an oversized minimum width on the grid. Added `min-width:0` to owner columns and allowed the button label to wrap with smaller padding. Post-fix RU and EN: scrollWidth = clientWidth = 305; form width = 275. `owners-overflow-320.png` and `owners-fixed-ru-320.png` were opened together after the fix. `owners-form-ru-320.png` shows the entire usable lower form.
- Navigation refinement: added a mobile menu entry for general requests while keeping the language selector visible in the header. Apartment CTA remains before the map.
- State refinement: catalogue filters are stored in the URL and restored on back/reload. Search checks all three translations and tolerates Vietnamese diacritics being omitted. Language changes retain filters and active content. Owner form values and open FAQ were verified across language changes.
- Source conversion issue caught and fixed before final validation: the two-bedroom label briefly referenced an out-of-scope translator; it now returns a stable source key. Final browser error checks are empty.

No unresolved P0/P1/P2 finding remains in the local frontend scope.

## Visual truth and comparison

Source images from the immediately preceding approved version:

- `local-review/work/homepage-copy-qa/hero-desktop.png`
- `local-review/work/homepage-copy-qa/hero-390.png`
- `local-review/work/homepage-copy-qa/viewing-desktop.png`

Rendered implementation: `http://127.0.0.1:4173/ru?variant=2&style=gradient`. Screenshots: `local-review/work/multipage-qa/`. Portable copies are in the v1 handoff's `preview/multipage/`.

All three before/after pairs were opened in a single comparison input: desktop hero, mobile hero and request dialog. The owner overflow/fix pair was also opened in the same input. Equal dimensions were confirmed with Sharp; no resizing or device frame was introduced.

| Comparison | CSS viewport | Pixels on both sides |
| --- | --- | --- |
| Desktop hero | 1647 × 912 | 1632 × 904 |
| Mobile hero | 390 × 844 | 375 × 812 |
| Viewing dialog | 1647 × 912 | 1647 × 912 |

Capture method: IAB page screenshots. The browser export uses its content region; device-pixel ratio was not separately overridden or measured. States: Russian, gradient style, variant 2, seaside selected, map loaded, scrollY 0 for hero pairs. The dialog is the same apartment/empty form; its background is intentionally different because it now opens from a property page. The modal is the focused comparison region, with labels and control geometry readable at this size; extra crops were unnecessary.

Intentional differences: a real language selector replaces the static RU badge; navigation has a Guides link and opens routes. Mobile general request moves into the menu to make room for language switching. The approved hero geometry, photo, CTA position and typography remain consistent.

## Required fidelity surfaces

- **Typography:** local Manrope UI and Cormorant Garamond headings retained. Added their Vietnamese subsets; inspected Vietnamese accents in headings, body copy and forms. Vietnamese heading line-height is adjusted to avoid crowded marks. Long headings wrap at 320 px without clipping.
- **Spacing/layout:** shared page margins, rounded photo frames, quiet borders and editorial spacing extend across catalogue, property, article and service pages. Desktop grids become deliberate mobile stacks. Property inquiry appears before the long description on phones. Owner overflow is corrected.
- **Colour:** ivory/navy and the existing blue/champagne generated art remain intact. No replacement illustration or competing accent palette was introduced. Selected states use the existing navy/gold treatment.
- **Imagery/icons:** existing local WebP interiors, glass artwork, street illustration and transparent logo reused. No fake property gallery or copied real listing imagery was added. Phosphor icons continue the original icon style.
- **Copy:** 375 source strings have local English/Vietnamese translations, including filters, apartment content, map labels, forms, validation, articles, empty states and demo messages. Native date controls/browser-generated validity text still follow browser settings. Three practical guides are newly written; old-site article authors/dates are not attributed to them. Live availability, real contacts and listing terms are not asserted.

## Functional and responsive checks

- Header/footer navigation; direct route load; language-prefixed links; invalid property route → 404 → catalogue. Page title and document `lang` update.
- Catalogue area, bedroom and budget combination; search `An Thuong` in VI returns two matches and stays at two in EN; high-to-low sort returns 950, 780, 620, 480. Empty result and reset work.
- Back from a property and reload restore query filters. Saved river apartment persists across language, route and reload. QA-created save is removed before handoff.
- Area selection routes to a correctly filtered catalogue (`hai-chau`, one apartment).
- Map from catalogue opens with the selected home; choosing the $480 studio and opening details reaches its own URL. All four hero marker centres are clickable at 1366 × 768. RU and VI laptop CTA bottom = 669 px.
- Vietnamese viewing request retains the selected river apartment and succeeds with contact only. Success is explicitly local and removes the submit action.
- English general shortlist from mobile menu succeeds with budget/contact and no date. Owner form rejects whitespace-only contact; name/area survive EN → VI; valid contact reaches local success.
- FAQ open state survives RU → EN. Article table of contents and direct `#part-2` load scroll to the intended section; unknown routes offer recovery.
- 27 route/language combinations at 320 × 760: nine routes in each of RU/EN/VI, one h1 per route, no unintended Russian text. Initial owner overflow was the only finding and was repaired. Initial evidence: `route-checks-320.json`; focused retest: `owners-recheck-320.json`.
- 14 additional checks at 768/1024 × 900 across seven Vietnamese page types: no overflow. Evidence: `route-checks-tablet.json`.
- Visual mobile checks at 390 × 844 include all three homepages, menu, catalogue/empty result and VI footer. At 320 × 760: property, viewing form, owner form, article and rental page. Desktop screenshots cover every main page type.
- Browser console errors after the route/interaction checks: `[]` (`browser-errors.json`).
- Final `npm run build`: passed. `npm run test:i18n`: 3 passed. `npm run test:sites`: 4 passed, including SPA fallback and build packaging. Large-chunk advisory remains for the app/MapLibre bundles; it does not prevent the build.
- Viewport override reset and main preview retained as a deliverable. No publication performed.

## Deliverables and limits

Implementation: `src/App.jsx`, `src/LandingSections.jsx`, `src/Pages.jsx`, `src/locale.jsx`, `src/messages.js`, `src/translations-*.js`, `src/pages.css`, `src/main.jsx`; translation checks in `tests/i18n.test.mjs`. Routes documented in `site-map.md`.

No live backend, real inventory, booking or request transmission. Map tiles need network access; generated property photos remain illustrative. Native device testing, formal accessibility certification and native-speaker editorial sign-off were not performed. Existing reduced-motion support remains; OS preference was not re-emulated in this pass. Language text and artwork are local assets.

Checklist: [x] additional pages; [x] RU/EN/VI throughout; [x] stable navigation and filter state; [x] forms and map; [x] mobile fixes; [x] paired visual comparison; [x] build/tests; [x] source handoff.

---

# Previous iteration records

# Design QA — homepage copy, viewing request and mobile CTA, 2026-09-21

**final result: passed**

Scope: the user accepted the review's proposed next pass: clarify homepage copy, separate apartment viewing from general shortlist requests, and bring the mobile details action before the map. The approved variant 2 composition, blue/champagne artwork and home-and-wave logo are preserved. Gallery expansion and real property terms are separate future work.

## Sources and implementation

- Visual baseline: `../homii-homepage-review/01-hero-desktop.png`, `03-viewing-request.png` and `05-mobile-hero.png`. These show the previously approved local page reviewed with the user.
- Copy source: https://www.dananghomesliving.com/en, supplied by the user. Its descriptions of lifestyle-based selection, accompanied viewings and support after handover informed the Russian copy. Conflicting response times, real availability, contacts and listing-specific terms were not generalized to demo apartments.
- Implemented files: `src/App.jsx`, `src/LandingSections.jsx`, `src/main.jsx`, `src/homepage.css`.
- Evidence originals: `local-review/work/homepage-copy-qa/`.
- Portable evidence in the delivery folder: `preview/homepage/`, including `before-hero-desktop.png`, `before-viewing-request.png`, `before-mobile-hero.png`.

## Comparison and capture state

The three baseline/after pairs were opened together in a single comparison input and visually inspected: complete desktop hero, complete mobile first viewport, and the focused request-dialog component. No synthetic browser rendering or device frame was used.

| Pair | CSS viewport | Baseline and after capture size |
| --- | --- | --- |
| Desktop hero | 1647 × 912 | 1632 × 904 px each |
| Mobile hero | 390 × 844 | 375 × 812 px each |
| Request dialog | 1647 × 912 | 1647 × 912 px each |

Pixel dimensions were read using Sharp. IAB exports the page content region; both sides used the same capture method and matched pixel dimensions, so no extra resizing was applied. Device-pixel ratio was not independently recorded. Final hero captures show variant 2, gradient theme, seaside apartment selected, map open, scrollY 0 and no comparison toolbar. The viewing modal retains the selected apartment. Loaded fonts are Cormorant Garamond and Manrope.

## Findings and final assessment

1. Fixed: the former viewing action led into a general budget/date form. It now opens a dedicated dialog with the apartment thumbnail, name and price, one required contact field, and optional preferred time. General shortlist stays a separate flow.
2. Fixed: the mobile details CTA appeared after the map. At 390 × 844 it now ends at y=703.17, immediately after the photograph; at 320 × 760 it ends at y=683.08. Exactly one details button is visible in each hero layout.
3. Fixed: prototype controls occupied the customer-facing page. They now render only with `preview=1`, preserving comparison and replay access through the design URL.
4. Copy refinement: added the long-term rental eyebrow, concrete service text, and a clearer about section. Arrival date is explicitly optional in general requests and the inline form.
5. Final visual refinement: mobile body copy increased to 13 px (12 px at the narrowest breakpoint), the viewing eyebrow shortened, and map/header controls given 44 px minimum targets. These changes were inspected after the final build.

Typography preserves the editorial serif headings and plain interface font. Layout changes are intentional: the mobile CTA sits between photo and map; the selected-home summary replaces irrelevant budget fields in the viewing dialog. Spacing remains generous without clipping at 320 px. Ivory, navy, blue/gold art and the approved logo remain consistent. Generated photos retain their aspect ratios and remain illustrative. No claim of pixel identity with the previous layout is made where copy or flow was intentionally changed.

No unresolved P0/P1/P2 finding was observed within this pass. This is a scoped visual/interaction check, not a comprehensive accessibility certification.

## Verification

- Desktop 1647 × 912, laptop 1366 × 768, mobile 390 × 844 and 320 × 760: no horizontal overflow in checked states. Laptop CTA bottom = 669 px; all four map price centers were unobscured.
- Mobile map collapse/reopen retains the details action. Selecting the $480 studio updates photo, caption, details and viewing summary consistently.
- Viewing: empty contact triggers native required validation; a valid dummy contact with blank optional time succeeds locally. Success preserves the home, receives focus, and removes the submit button. Escape/return close the dialog.
- General shortlist: whitespace-only contact is rejected; valid budget/contact succeeds with the date blank. Its heading, fields, button and success text are distinct from viewing.
- Inline inquiry: budget/contact with no arrival date reaches local demo success and can reset.
- Preview mode: toolbar appears only with `preview=1`; theme and variant changes retain the selected studio. Calm mobile and variant 3 checks had no horizontal overflow.
- Browser console error query after interactions: empty.
- `npm run build`: passed after final source changes. Existing large MapLibre chunk advisory remains; no new dependency was introduced.
- Temporary viewport override reset; main local preview left open and marked as a deliverable. Temporary comparison tab closed.

Evidence: `hero-desktop.png`, `hero-laptop.png`, `hero-390.png`, `hero-320.png`, `viewing-desktop.png`, `viewing-390.png`, `viewing-320.png`, `about-footer-desktop.png`, `about-footer-320.png`, `calm-preview-390.png`. `shortlist-validation.png` in the delivery folder records an intentional validation state with the browser tooltip visible; its work-folder original is `shortlist-desktop.png`.

## Limits

All apartments, prices and coordinates remain demonstration records; generated photography is illustrative. Forms do not transmit requests. Map tiles need network access. OS reduced-motion was not freshly emulated in this pass; the existing implementation is retained. Publishing and Sites handoff were not requested. Gallery/real terms are outside the agreed pass, not blocked work.

---

# Previous iteration records (historical behavior and checks)

# Design QA — quiet map, laptop hero and motion, 2026-09-21

**final result: passed**

Scope: the user accepted the focused next iteration proposed in the review: quieter map, a complete hero on laptop screens, subtle illustration reveals and photograph transitions. The generated art, blue/champagne direction, content, forms and selected variant 2 remain the foundation. Gallery expansion is outside this iteration.

## Visual evidence

Reference: `local-review/outputs/homii-design-review/01-hero.png`.

Evidence directory: `local-review/work/polish-qa/`.

- `hero-desktop.png`: final variant 2, gradient theme, studio selected, map open, scrollY 0, CSS viewport 1647 × 912.
- `hero-before-after.jpg`: inspected side-by-side comparison in the same state and viewport. Both original captures are 1632 × 904 exported pixels, with no device frame.
- `hero-laptop.png`: final 1366 × 768 hero with all price labels fully clickable and the CTA above the comparison toolbar.
- `hero-1024.png`: intermediate laptop width; the photo, heading and CTA fit.
- `map-320.png`: final narrow map, with separated price labels connected to their true coordinates.
- `hero-mobile.png`, `map-mobile.png`: 390 × 844 photo/map composition inspected during the iteration.
- `process-desktop.png`, `process-320.png`: loaded artwork and copy after their reveal.
- `map-modal.png`, `variant3-320.png`: secondary map and alternate hero remain usable.

The source, final render and combined comparison were opened and inspected. This iteration intentionally reduces the heading/media height on laptops and changes cartographic styling; it does not claim pixel identity with the preceding screenshot.

## Findings and fixes

1. P2, fixed: the principal CTA was partly below the initial laptop viewport. The desktop gradient hero now allocates its height using the viewport and reserves room for the comparison toolbar. At 1366 × 768, CTA bottom = 669 px and toolbar top = 694 px.
2. P2, fixed: the compact map could place the top price under the view toggle and allow nearby prices to overlap. Increased safe map padding, then separated labels on maps under 380 px high. Leaflet connectors preserve the actual geographic anchor. Final checks at 1366 and 320 px hit-tested all four inset corners of every price button: all uncovered.
3. Visual refinement: replaced the busy gradient-theme raster map with a local ivory/blue vector style, fewer labels, quieter roads and visible river/coast. Calm theme retains its previous OSM map. Attribution remains visible.
4. Motion refinement: 600 ms photograph crossfade retains the outgoing frame under the incoming one. During a measured transition, outgoing opacity remained 1 while incoming opacity was 0.818; final state has exactly one visible active photo. Rapid next-clicks resolve to the latest selected home.
5. Motion refinement: artwork reveals once with delays 0/70/140/210 ms; captions and controls do not wait for the observer. Selected prices get one 800 ms highlight using the existing generated ribbon. No continuous looping animation.

## Verification

- Production build passed after final source changes. Map style validation via `validateStyleMin` returned no errors.
- Vector map reached `data-map-status=ready`; raster fallback was observed while the style file was temporarily absent during implementation. Both themes preserved selection.
- Studio, seaside, river and family selections update the photograph/caption. Keyboard focus remains on the selected price button after marker refresh.
- Full map dialog loads the vector map, changes the selected apartment, supports zoom and closes with Escape.
- Variant 3 renders at 320 px, and returning to variant 2 works.
- Mobile menu closes after section selection. All four illustration reveal states became visible, with fully loaded image assets.
- No horizontal overflow at 1647, 1366, 1024, 390 or 320 px widths in tested states.
- Final browser console errors/warnings: none. Four hero images loaded, one active frame, no blank final photograph.
- Temporary viewport override reset; preview tab retained as a deliverable; local server left running.

## Five fidelity surfaces and limits

Typography keeps local Cyrillic Cormorant Garamond and Manrope; only desktop hero sizing adapts to height. Layout keeps the approved photo/map split, CTA strip and page order. Colors carry the existing ivory, blue and champagne into the map. All six generated assets and property images remain unchanged. Russian content and demo disclosures are preserved.

No actionable P0/P1/P2 findings remain within this scope. `prefers-reduced-motion` handling is implemented in the observer, CSS transitions and map setup, but OS preference emulation was not separately run. Forms/backend behavior was not changed or retested in this pass. Map tiles and map glyphs require network access. The lazy MapLibre chunk produces Vite's size advisory (about 287 KB gzip); additional bundling optimization is a P3 follow-up, not a failed build. WebGL-constructor fallback cleanup is implemented but was not separately forced in the browser.

---

# Previous iteration — blue/champagne gradient refresh, 2026-09-21

**final result: passed**

Scope: restore the original screenshot's warm ivory, sapphire, champagne and amber art direction while retaining the already approved variant 2 layout and linked apartment/map behavior. This is a style refresh, not a pixel-for-pixel clone of the first screenshot. The earlier calm theme and hero variant 3 remain available.

## Reference and comparison

Style source: `исходный дизайн-референс`, 1440 × 4889. Existing variant 2 remains the layout source recorded below.

Preview: `http://127.0.0.1:4173/?variant=2&style=gradient`.

Evidence: `local-review/work/gradient-qa/`.

- `hero-desktop.png`, `process-desktop.png`, `form-desktop.png`: desktop screenshots at 1440 × 1100 CSS viewport. Browser export includes scrollbar differences.
- `hero-style-comparison.jpg`: original hero and new implementation shown together, preserving their proportions; compared for palette, gradients, photo prominence and hierarchy rather than identical layout.
- `art-style-comparison.jpg`: original process illustrations and the new illustrated steps shown together.
- `generated-asset-series.jpg`: all six generated assets, also individually inspected before integration.
- `hero-mobile.png`, `process-mobile.png`, `form-mobile.png`: actual 390 × 844 viewport, with separate scroll positions.
- `form-320.png`, `footer-320.png`, `variant3-320.png`: actual 320 × 844 narrow-screen evidence.

The original, new renders and paired comparison sheets were opened and visually inspected. The glass objects have matching materials, ivory backgrounds, soft blue/gold ribbons and contact shadows. Hero keeps the large unobstructed interior photo, with the brand ribbon framing the photograph and functional map.

## Five fidelity surfaces

- Typography: approved local Cyrillic Cormorant Garamond and Manrope are retained. Ivory panels keep body text away from strong gradient transitions. Form/footer use readable light-on-navy text.
- Layout: hero, catalog and lower-section order remain unchanged. Four illustrated process cards use balanced objects and consistent text padding. Narrow viewports stack the hero and use two process columns; form and footer remain within the viewport.
- Color: ivory #fcfaf5 / #f7f2e9, navy #102642, cobalt #24528f, amber #edb96c and champagne #e8d5b4 follow the supplied reference. The generated background provides the flowing color transitions.
- Images: six new ImageGen originals and optimized local WebPs; interiors remain prominent and unchanged. Decorative sculptures do not imply verified inventory. No placeholder images or broken assets found.
- Copy: existing Russian content and explicit demo disclosures are retained. Comparison controls clearly distinguish theme and hero composition.

## Browser and build checks

- Clicking studio $480 and seaside $620 updates the selected photo/caption. OSM tiles load correctly.
- Theme switching changes artwork and surfaces while preserving the selected apartment. Calm theme removes the process art and restores the district street photo.
- Mobile menu closes after section navigation. Process CTA reaches the inline form.
- Inline form accepts dummy budget 800, date 2026-10-15, one bedroom and contact `@demo_qa`; shows explicit local-only success and moves focus there. Reset restores the fields. No external request sent.
- Sliders control exposes variants 2/3. Variant 3 renders at 320 px; switching back restores the main composition.
- Horizontal overflow checks: desktop client/scroll widths 1425/1425; 390 px viewport 375/375; 320 px viewport 305/305.
- All page images loaded. Final console warnings/errors: none.
- `npm run build`: passed after all UI changes.

No actionable P0/P1/P2 issues found in this refresh. Retained limitations: four demo properties, illustrative photos and coordinates, local-only forms, internet-dependent OSM tiles. Reduced-motion styles are inherited, but OS preference emulation was not separately repeated in this refresh.

## Checklist

- [x] Generate, inspect and optimize a cohesive six-image series.
- [x] Integrate the original palette into hero, districts, process, form and footer.
- [x] Preserve photo/map interactions and both earlier comparison options.
- [x] Inspect desktop, real phone viewports and paired style comparisons.
- [x] Pass production build and local interaction smoke checks.

---

# Previous iteration — full landing, selected variant 2

**final result: passed**

Scope: complete the full page in the user-approved variant 2 direction. The existing photograph/map hero is preserved, and the catalog, districts, rental process, inline inquiry, FAQ, about section, and footer are completed. Variant 3 remains available. No publication or live integration.

## Evidence and comparison

Source visual truth: `C:/Users/romas/.codex/generated_images/01a0bf8e-d79f-7862-b612-6574733ea0e6/exec-142cce5b-8f4c-4db2-96e1-3f1ac804f4e0.png` (1422 × 1106).

Implementation: `http://127.0.0.1:4173/?variant=2`. Evidence folder: `local-review/work/homii-qa/`.

- `fullpage-desktop-final.png`: complete page at 1422 × 1106 CSS viewport, exported at 1407 px width; default seaside home, map open, three cards, first district, closed FAQ, empty form.
- `fullpage-hero-final.png`: final desktop first viewport, 1422 × 1106 exported pixels.
- `fullpage-hero-comparison-final.jpg`: selected source aligned to 1422 × 1106 and placed beside the final implementation. The final pair has equal pixel dimensions; no device frame was included.
- `fullpage-hero-focus.jpg`: joint focused comparison of heading, caption, and CTA/trust strip.
- `fullpage-mobile-final.png`, `hero-mobile-fixed.png`, `lead-mobile.png`, `footer-mobile.png`: actual mobile viewport and scrolled section evidence, not a scaled desktop poster.
- `form-320.png`, `form-320-fixed.png`, `mobile-caption-comparison.jpg`: before/fixed evidence for the narrow layout and photo caption.
- `lead-desktop-filled.png`: completed inline form before local submission.

Reference and rendered output were opened and compared together. The source defines the hero and the beginning of the catalog; the newly requested lower sections extend that direction and are not claimed to reproduce an unseen reference pixel for pixel. Full-page composition and individual mobile sections were visually inspected.

## Findings and iteration history

1. P2, fixed: 320 px viewport exposed a 15 px horizontal scroll because the old body minimum width ignored the browser scrollbar. Changed body minimum width to zero and allowed the narrow hero CTA/trust row to shrink and wrap. Post-fix DOM check: clientWidth = scrollWidth = 305, with innerWidth = 320. Visually confirmed in `form-320-fixed.png`.
2. P2, fixed: at 390 px, photo metadata and the price overlapped inside the compact caption. Wrapped the caption into two rows below 430 px. `mobile-caption-comparison.jpg` shows the correction. Post-fix metadata bottom 523.75 px; price top 530.75 px, with clear separation.
3. P2, fixed: individual district inquiry lost the selected district. Added a district context prop to the request modal. Browser now visibly says the requested Ngu Hanh Son area after selecting its request action.
4. Readability refinement: increased new mobile body text and field labels; bedroom choices now have 44 px outer height. Verified 320 px form and 390 px footer.

No actionable P0/P1/P2 findings remain in the local prototype scope.

## Required fidelity surfaces

- Typography: local Cyrillic Cormorant Garamond headings and Manrope interface text are carried throughout. Serif hierarchy, restrained labels, and deliberate heading breaks match the approved direction. Mobile caption no longer overlaps.
- Layout rhythm: the main hero proportions remain intact. Three catalog cards precede an editorial photo/area list, four steps, navy form, two-column FAQ, centered about section and warm footer. Expanded four-card catalog uses an even two-column grid. Mobile stacks sections, with a two-column process grid.
- Colors: existing ivory #fcfaf5, navy #11243f, muted gray, and gold accents are reused. The form uses a related navy #12253f and ivory fields; no competing accent palette.
- Imagery: local generated interiors are unchanged; the new 1200 × 1600 street image is a separate generated and visually inspected WebP asset. It is illustrative, not a verified address. Icons use Phosphor. Map imagery remains real OSM tiles rather than the schematic generated reference.
- Copy: Russian page copy follows the original rental proposition. Demo inventory, generated photography and local-only forms are explicitly disclosed. No fabricated testimonials or actual request delivery claims.

## Browser checks

- Catalog expand: three cards to four, equal two-column layout; collapse restores three.
- Hai Chau district action: one matching river apartment in the catalog; All restores catalog.
- District keyboard arrows move selection and focus; selected tab panel updates.
- Ngu Hanh Son request preserves its district context; Escape closes dialog.
- Header and footer section navigation; mobile hamburger opens and closes after section selection.
- FAQ opens an answer and closes the previous answer.
- Inline form: blank submission focuses budget and reports three invalid required fields; budget 800, date 2026-10-15, one bedroom and a dummy contact produce explicit local-only success. Focus moves to success. Reset restores editable form.
- 1422 × 1106 desktop, 768 × 1024 width check, 390 × 844 mobile top/scrolled form/footer, 320 × 844 form and overflow correction.
- Variant 3 still renders all seven sections and has no horizontal overflow at desktop.
- Final desktop: all images loaded and no horizontal overflow. Console errors/warnings: none.
- `npm run build`: passed after final code changes.
- Temporary viewport override reset; preview tab marked as deliverable; local server kept running.

## Limits and follow-up polish

Four demo properties, no live availability, booking, messaging or backend requests. Map tiles require internet. Favorites are held only in the open page. Reduced-motion rules exist, but OS reduced-motion and native physical-device keyboard sessions were not separately emulated. P3: exact serif metrics and custom map tiles may be refined later; both are inherited from the already approved working hero.

## Implementation checklist

- [x] Preserve the selected hero and linked map behavior.
- [x] Complete all lower page sections and their principal interactions.
- [x] Generate, inspect and optimize the supporting photo.
- [x] Inspect desktop/mobile composition and fix found responsive defects.
- [x] Verify form, districts, FAQ, navigation and console.
- [x] Compare source/rendered evidence, pass build and keep preview open.

---

# Previous hero iteration record

# Design QA — Danang Homii

**final result: passed**

Scope: two selected desktop hero concepts implemented as one interactive local prototype, with a responsive layout. The user asked to try variants 2 and 3 and click the map points. No production integration or deployment was requested.

## Visual truth and browser evidence

Source variant 2: `C:/Users/romas/.codex/generated_images/01a0bf8e-d79f-7862-b612-6574733ea0e6/exec-142cce5b-8f4c-4db2-96e1-3f1ac804f4e0.png`

Source variant 3: `C:/Users/romas/.codex/generated_images/01a0bf8e-d79f-7862-b612-6574733ea0e6/exec-3ee86a12-1598-47d3-a3fb-9136ccbd8b0f.png`

Both source images: 1422 × 1106 pixels. Desktop browser CSS viewport: 1422 × 1106. The in-app browser screenshot export returned 1407 × 1094 pixels; the sources were proportionally normalized to that export size before the final side-by-side comparison. No device frame was included.

Evidence folder: `local-review/work/homii-qa/`.

- `variant2-desktop-final.png`: variant 2, map open, seaside apartment selected.
- `variant3-desktop-final.png`: variant 3, map open, seaside apartment selected.
- `comparison-2.jpg`, `comparison-3.jpg`: normalized source and implementation together.
- `focus-2.jpg`, `focus-3.jpg`: joint focused comparisons of the photograph, map, selection controls and caption.
- `variant2-mobile.png`, `variant3-mobile-top.png`, `variant3-mobile-scroll.png`: mobile evidence.
- `variant2-before.png`: initial map-provider problem.

The selected source images, browser captures, full comparisons and focused comparisons were visually inspected. Final captures use loaded images; the final variant 3 photo opacity was verified as 1.

## Findings and iteration history

1. **P1, fixed — unusable basemap provider.** The initial CARTO endpoint returned a map with an API-key watermark. Replaced it with OpenStreetMap tiles and retained visible attribution. Browser verification showed a normal loaded map; all tiles and local images were loaded in the final desktop check.
2. **P2, fixed — atlas price partially obscured by the photograph.** The photo covered part of the lowest price marker. Offset price labels from their coordinates and connected them using Leaflet lines and location dots. Checked both corners of all four price buttons with DOM hit testing: every button is unobscured in the final desktop state.
3. **P2, fixed — desktop marker offsets persisted on mobile resize.** Added a responsive media-query state so map framing and label offsets rebuild at the breakpoint. Verified 390-pixel interactions and 320-pixel bounds. No horizontal page overflow in tested states.
4. **P2, fixed — mobile heading merged two words.** Restored explicit line breaks instead of hiding the first break. Inspected the corrected mobile heading and scrolled hero.
5. **P2, fixed — selected-card details action hidden on narrow screens.** Retained it as an accessible compact icon button over the photo instead of removing the action.
6. **P2, fixed — repeat-clicking the active variant closed the map.** Active-variant selection now leaves the current view unchanged. Replay is handled by its separate button.
7. **P2, fixed — clicks during map movement could miss their target.** Map interaction is inert during its introductory transition. Markers become available after the panel settles. Marker emphasis updates without replaying every pin's entrance; keyboard focus is retained after a selection.

No actionable P0/P1/P2 findings remain within the prototype scope.

## Five fidelity surfaces

- **Fonts / typography:** local Cyrillic Manrope and Cormorant Garamond preserve the sans-serif controls and editorial serif headline. Heading hierarchy and intentional line breaks are retained. Small control sizes and exact serif metrics differ slightly from the generated mock; remaining refinement is P3.
- **Spacing / layout:** variant 2 preserves the connected photo/map composition and inline property caption. Variant 3 preserves the left editorial column and floating photo over a city map. Its photograph sits lower than the static mock so every real map marker remains clickable. The mobile composition stacks these regions deliberately. No horizontal overflow at desktop, 390 px, or the checked 320 px atlas layout.
- **Colors / tokens:** warm ivory #fcfaf5, navy #11243f and selected-marker gold #b68a49. Functional map tiles have more street detail than the schematic generated reference; this is an intentional substitution of a real map for invented geometry.
- **Image / asset quality:** four separate full-resolution generated interiors, served as optimized local WebP files. Actual brandmark was extracted from the supplied reference. Standard icons come from Phosphor, not custom-drawn stand-ins. The same selected home uses the same photo in both modes, map details and catalogue.
- **Copy / content:** Russian headlines and primary actions follow the selected concepts. Photo counter represents four demo apartments, not six unavailable images. Coordinates, prices and photography are explicitly marked as illustrative. No form submission claims actual delivery.

## Functional checks performed in the browser

- Variant switching and synchronized apartment state.
- Clicking $620, $480, $780 and $950 changes the relevant photograph, price and metadata.
- Map/photo toggle, one-time map reveal and replay after hiding the map.
- Full map modal; selecting a studio updates its details panel.
- Apartment details modal and prefilled request form.
- Required date/contact fields and local-only success state with explicit no-send wording.
- Favorite toggle and favorite-only filter: one saved apartment yields one visible card.
- Escape closes modals. Keyboard focus stays on the selected map price button after rebuilding markers.
- Responsive checks: both variants at 390 × 844, atlas bounds at 320 × 844, desktop at 1422 × 1106.
- Final desktop DOM check: no horizontal overflow; all four map buttons clickable; all images loaded.
- Browser console error/warning query: empty.
- `npm run build`: passed after final source edits.

## Expected limits / follow-up polish

- These are demo records, not live inventory. No booking, messaging or backend submission is connected.
- Map tiles require internet; local images and fonts do not.
- Favorites last for the open page session only.
- P3: closer custom map styling and exact serif matching can be refined after choosing a composition. Marker-label offsets intentionally favor clickability over copying schematic locations.
- Reduced-motion handling is implemented in CSS and Leaflet options; a separate OS preference session was not emulated.

## Implementation checklist

- [x] Generate and place real image assets.
- [x] Implement both selected compositions and linked apartment controls.
- [x] Fix map access and responsive marker overlap.
- [x] Compare captured source/implementation pairs and focused regions.
- [x] Verify primary interactions and console output.
- [x] Build the application and keep the local preview available.
