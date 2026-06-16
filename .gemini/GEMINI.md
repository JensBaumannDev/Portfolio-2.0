You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Do NOT write any comments in the code

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.
- Minimum font-size must be 16px.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## SCSS and Styling Best Practices

- Always import and include the `abstracts` directory (containing variables, mixins, and functions) in all component SCSS files (e.g., `@use 'src/styles/abstracts' as *;` or `@use 'src/styles/abstracts';`).
- Always use global variables, typography, and mixins when styling components.
- Use the `flex()` mixin for all Flexbox layouts.
- Use the z-index layer system defined in variables for managing component depth (`z-index`).
- Avoid hardcoding values; prefer variables from `_variables.scss` and mixins from `_mixins.scss`.
- Responsive content (e.g., `@media` queries or responsive mixins like `@include mobile`) must be placed at the very bottom of every SCSS file, grouped inside a `/* #region RESPONSIVE */` and `/* #endregion */` block.
- Never use `overflow: hidden` or `!important`.
- Never write raw `px` or `rem`/`em` values for sizing or spacing. Use the `rem()` function from `abstracts` instead (e.g. `padding: abs.rem(16);`), passing the value in pixels. It converts to `rem` at build time so layouts scale with the user's font-size setting.
  - Keep raw `px` only for purely graphical details that must not scale: `border`, `outline`, `box-shadow`, `perspective`, `blur()`, transform/animation offsets, and `$breakpoint-*` values in media queries.

