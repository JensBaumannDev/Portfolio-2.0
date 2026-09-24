import { Injectable, OnDestroy, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

type ResolvedTheme = Exclude<ThemeMode, 'system'>;

const STORAGE_KEY = 'theme';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  private readonly currentMode = signal<ThemeMode>(initialThemeMode());
  private readonly colorSchemeQuery = getColorSchemeQuery();
  private readonly systemPrefersDark = signal(this.colorSchemeQuery?.matches ?? false);
  private readonly onColorSchemeChange = (event: MediaQueryListEvent): void => {
    this.systemPrefersDark.set(event.matches);
  };

  readonly mode = this.currentMode.asReadonly();

  constructor() {
    this.colorSchemeQuery?.addEventListener('change', this.onColorSchemeChange);

    effect(() => {
      const mode = this.currentMode();
      let effectiveTheme: ResolvedTheme = mode === 'system' ? 'light' : mode;
      if (mode === 'system') {
        effectiveTheme = this.systemPrefersDark() ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', effectiveTheme);
      applyFavicon(effectiveTheme);
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
        'content',
        getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
      );
    });
  }

  ngOnDestroy(): void {
    this.colorSchemeQuery?.removeEventListener('change', this.onColorSchemeChange);
  }

  setThemeMode(mode: ThemeMode): void {
    this.currentMode.set(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }
}

function getColorSchemeQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
  return window.matchMedia(COLOR_SCHEME_QUERY);
}

function applyFavicon(theme: ResolvedTheme): void {
  document.querySelectorAll('link[rel="icon"]').forEach((link) => link.remove());

  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = `favicon-${theme}.svg?v=3`;
  document.head.appendChild(link);
}

function initialThemeMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'system') {
    return stored;
  }
  return 'system';
}
