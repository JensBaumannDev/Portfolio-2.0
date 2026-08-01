import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

type ResolvedTheme = Exclude<ThemeMode, 'system'>;

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly currentMode = signal<ThemeMode>(initialThemeMode());
  private readonly systemPrefersDark = signal<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);

  readonly mode = this.currentMode.asReadonly();

  constructor() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.systemPrefersDark.set(e.matches);
    });

    effect(() => {
      const mode = this.currentMode();
      let effectiveTheme: ResolvedTheme = mode === 'system' ? 'light' : mode;
      if (mode === 'system') {
        effectiveTheme = this.systemPrefersDark() ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', effectiveTheme);
      applyFavicon(effectiveTheme);
    });
  }

  toggle(): void {
    const current = this.currentMode();
    if (current === 'light') this.setThemeMode('dark');
    else if (current === 'dark') this.setThemeMode('system');
    else this.setThemeMode('light');
  }

  setThemeMode(mode: ThemeMode): void {
    this.currentMode.set(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }
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
    return stored as ThemeMode;
  }
  return 'system';
}
