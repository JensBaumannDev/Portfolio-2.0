# Portfolio

Angular 21, TypeScript, SCSS, ngx-translate (DE/EN), ng-icons. Contact form via `public/send_mail.php`.

```bash
npm start        # dev server, localhost:4200
npm run build    # must pass before a PR
```

Branches `feature/*` / `fix/*`, commits like `feat(about): ...`.

## TypeScript

- Strict types, no `any` (use `unknown`)
- Prefer inference when the type is obvious
- No comments in code

## Angular

- Standalone components, don't set `standalone: true`
- Signals for state, `computed()` for derived state, `set`/`update` instead of `mutate`
- `input()` / `output()` instead of decorators
- `ChangeDetectionStrategy.OnPush` everywhere
- Lazy-load routes
- Host bindings in the `host` object, no `@HostBinding` / `@HostListener`
- `NgOptimizedImage` for static images (not for base64)
- `@if` / `@for` / `@switch`, class and style bindings instead of `ngClass` / `ngStyle`
- Reactive forms
- Services: single responsibility, `providedIn: 'root'`, `inject()`

## Accessibility

- AXE clean, WCAG AA (focus, contrast, ARIA)
- Min. font size 16px
- Respect `prefers-reduced-motion`

## SCSS

- `@use 'src/styles/abstracts' as *;` in every component
- Variables and mixins from abstracts, `flex()` mixin for flexbox, z-index layers from variables
- Sizes and spacing via `rem()`; raw `px` only for borders, outlines, shadows, blur, transforms, breakpoints
- Media queries at the bottom in `/* #region RESPONSIVE */ ... /* #endregion */`
- No `!important`, no `overflow: hidden` (use `overflow: clip`)

## Pages

- `/` start page, in this order: hero, project rail, two intro cards (career change, certificate), career rows, skills, testimonials, contact block
- `/projects/:slug` project detail, `/about`, `/contact` (form), legal pages, 404
- Nav: name as text (no logo), Projekte / Über mich / Skills / Kontakt, LinkedIn / GitHub / Malt as icon buttons (icon only between 761 and 1180), menu button on mobile
- Hero: "Willkommen." intro, title, subline, stack line, buttons Projekte ansehen + Lebenslauf, portrait at the bottom
- Project rail: no heading, cards peek below the hero, whole card links to the detail page, buttons Details + Live ansehen, arrows/dots and arrow keys, image zoom 1.05 on hover
- Intro cards: portrait right, buttons pinned to the bottom so both cards line up
- Contact block on the start page links to `/contact`; the form there keeps the existing logic (honeypot, timing check, `send_mail.php`)
- Project detail: hero with browser mockup (laptop image as fallback), slider with side swipe, then short description, role/team/duration and cards for technologies, features, implementation and technical focus
- Max. three portraits on the start page

## Design

- Font: Urbanist (400–700), self-hosted, body 500
- Colors: ink `#171a20`, text `#393c41`, labels `#5c5e62`, 2nd heading line `#86868b`, lines `#e5e5e5`, surface `#f4f4f4`, blue `#0071e3` / `#0062c4`, dark button `#2c2c2e`
- Hero glow `rgba(150, 165, 255, 0.22)`
- Radius 16 (surfaces), 10 (buttons)
- Section gap `clamp(72, 9vw, 150)`, nav height 56
- One blue button per group, first; secondary = dark button
- Headings in two lines: ink + grey
- Flat grey cards, no shadows, no hover lift
- Subpages (project, about, contact) use the shared page hero; footer on every page
- Keep the "Willkommen." intro on the start page
- Project pages: browser mockup with 1px `rgba(255,255,255,.5)` border + project slider
- Portraits: transparent cutouts, bottom-aligned, never cropped at a joint

## i18n

- All text in `public/i18n/de.json` and `en.json`, always update both
