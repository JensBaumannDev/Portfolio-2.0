# Redesign-Plan — Umbau nach Mockup

Quelle: `C:\Users\bauma\Desktop\Jens Baumann — Portfolio.pdf` (beim Umsetzen geöffnet halten und pro Sektion erneut gegen das PDF prüfen — exakte Farbwerte, Abstände und Schriftgrößen immer aus dem Mockup übernehmen, nicht schätzen).

Status: Plan erstellt am 2026-07-07. Umsetzung startet in neuer Session.

## Arbeitsweise (gilt für jede Phase)

- **Nichts pushen, keine PRs.** Alles bleibt lokal (Branches + Commits lokal sind ok), bis Jens das fertige Ergebnis abgenommen hat. Erst nach expliziter Abnahme wird gepusht.
- Pro Phase ein lokaler Branch von `main` (Namen unten).
- GEMINI.md (`.gemini/GEMINI.md`) strikt einhalten. Wichtigste Punkte fürs Redesign:
  - Keine Kommentare im Code.
  - Keine rohen `px`/`rem`-Werte → `abs.rem()`-Funktion; Ausnahmen nur border/outline/shadow/blur/transform-offsets/breakpoints.
  - `flex()`-Mixin für alle Flex-Layouts, Z-Index nur über das Layer-System.
  - Responsive-Styles ausschließlich am Dateiende im `/* #region RESPONSIVE */`-Block.
  - Kein `overflow: hidden`, kein `!important`.
  - WCAG AA: Kontrast prüfen (v. a. bei neuen Farbtokens), Mindest-Schriftgröße 16px, Fokus-Styles nicht entfernen.
  - Neue statische Bilder mit `NgOptimizedImage`.
- Nach jeder Sektion: visuelle Verifikation im Preview (Desktop 1280, Tablet 768, Mobile 375), **jeweils in Light- und Darkmode**, und Vergleich mit der entsprechenden PDF-Seite.
- Beim Umbau einer Sektion frei werdende Styles/Variablen/Assets sofort mit entfernen — nicht erst am Ende sammeln (Endkontrolle in Phase 5 bleibt trotzdem).
- Bestehende Reveal-Animationen (`reveal.directive.ts`, `reveal-stagger.directive.ts`) beibehalten, sofern das Mockup nichts anderes zeigt.

## Phase 0 — Design-Foundation (`feat/redesign-foundation`)

Grundlage für alles Weitere, zuerst umsetzen:

1. `src/styles/abstracts/_variables.scss`:
   - Farbwerte aus dem Mockup extrahieren und die bestehenden Tokens aktualisieren (Akzent, Hintergründe hell/dunkel, Textfarben). Bestehende Token-Namen beibehalten, nur Werte ändern — dann ziehen die Änderungen automatisch durch alle Komponenten.
   - Nur dort neue Tokens ergänzen, wo das Mockup neue wiederkehrende Werte einführt (z. B. Card-Hintergründe, neue Border-Farben).
2. **Darkmode-Architektur:** SCSS-Variablen sind Compile-Zeit — für den Theme-Wechsel semantische CSS-Custom-Properties einführen (z. B. `--color-bg`, `--color-text`, `--color-accent`), definiert auf `:root` (Light) und `[data-theme='dark']`. Komponenten nutzen nur noch die semantischen Properties; die SCSS-Tokens liefern die Rohwerte. Theme-Service mit Signal: initial `prefers-color-scheme`, Wahl in `localStorage` persistieren (analog zur Sprachpersistenz).
3. `src/styles/base/` (Typografie): Schriftfamilie, -größen und -gewichte ans Mockup angleichen. Falls neue Font nötig: lokal einbinden (kein CDN wegen Hosting), `font-display: swap`.
4. Globale Section-Abstände/Container-Breiten prüfen (`$max-width`, Section-Padding) und ans Mockup angleichen.
5. Verifikation: Landingpage im Preview durchscrollen (Light + Dark) — nichts darf kaputt sein, nur Farben/Typo geändert.

## Phase 1 — Navigation + Hero (`feat/redesign-nav-hero`)

- `components/navigation/`: Layout, Zustände (aktiv/hover) und Mobile-Menü nach Mockup-Seite mit dem Header umbauen.
- **Darkmode-Toggle** in die Navigation einbauen (nutzt den Theme-Service aus Phase 0; `aria-label`/`aria-pressed` für a11y).
- **Sprachumschalter DE/EN** beibehalten (ngx-translate + Persistenz existieren bereits) und optisch nach Mockup gestalten.
- `components/hero/`: Aufbau (Headline, Subline, CTAs, Bild/Grafik) exakt nach Mockup-Startseite. `hero-section-inner`-Wrapper in `landingpage.component.html` ggf. anpassen.
- Verifikation: alle drei Viewports + Scroll-Verhalten der Navbar.

## Phase 2 — About + Skills (`feat/redesign-about-skills`)

- `components/about/`: Layout und Inhaltsstruktur nach Mockup.
- `components/skills/`: Darstellung der Skills (Grid/Icons/Labels) nach Mockup umbauen.
- Verifikation wie oben, inkl. Reveal-Animationen.

## Phase 3 — Projects (`feat/redesign-projects`)

- `components/projects/` + `project-dialog/`: Karten-Layout, Hover-Zustände und Dialog nach Mockup. Card-Flip-Dauer bleibt 600ms (kürzlich vereinheitlicht) — nur ändern, falls das Mockup-Verhalten explizit anders ist.
- `services/github.service.ts` nur anfassen, falls das Mockup andere Daten pro Projekt zeigt.
- Verifikation: Dialog öffnen/schließen, Tastaturbedienung (ESC, Fokus-Falle) — AXE-relevant.

## Phase 4 — Contact + Footer (`feat/redesign-contact-footer`)

- `components/contact/` („Sprechen wir."): **Das Kontaktformular bleibt auf jeden Fall bestehen** (Reactive Form inkl. Validierung, Fehler- und Erfolgszuständen sowie Submit-Logik unverändert übernehmen) — es wird nur optisch sauber in das neue Sektions-Design aus dem Mockup eingearbeitet. Falls das Mockup dort kein Formular zeigt: Design der Sektion übernehmen und das Formular stimmig darin integrieren, nicht entfernen.
- `components/footer/`: nach Mockup angleichen.
- Verifikation: Formular-Validierung durchklicken, Fehlerfarben auf Kontrast prüfen.

## Phase 5 — Unterseiten + Feinschliff (`feat/redesign-subpages`)

- `pages/cv/`, `pages/legal-notice/`, `pages/privacy-policy/`: an neue Design-Sprache angleichen (Typo/Farben kommen größtenteils automatisch über Phase 0; Layout prüfen).
- **Dead-Code-Cleanup (Pflicht, 100% sauberer Code):**
  - Jede Variable in `_variables.scss` per Suche auf Verwendung prüfen — alle ungenutzten Farb-/Token-Definitionen löschen (nach dem Redesign werden viele alte Werte wie Glass-/Navbar-Farben vermutlich tot sein).
  - Gleiches für Mixins/Funktionen in `abstracts/` und Styles in `src/styles/components/`.
  - Ungenutzte Assets (alte Bilder/Icons), tote Translation-Keys in den DE/EN-JSONs und nicht mehr referenzierte Komponenten/Direktiven entfernen.
- Gesamtdurchlauf: alle Seiten, beide Sprachen (Sprachpersistenz testen), **beide Themes (Light/Dark, Kontrast AA in beiden)**, AXE-Check, Konsole auf Fehler prüfen, Production-Build (`ng build`) muss sauber durchlaufen.
- **Abnahme durch Jens.** Erst danach: pushen, PRs, Deployment auf Hetzner (public_html, .htaccess-Routing beachten).

## Offene Punkte

- Exakte Farb-/Typo-Werte pro Sektion beim Umsetzen direkt aus dem PDF ablesen.
- Falls das Mockup Sektionen anders anordnet als aktuell (Home → About → Projects → Skills → Contact), Reihenfolge in `landingpage.component.html` und Nav-Links anpassen.
