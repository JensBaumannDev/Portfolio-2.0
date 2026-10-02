import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, Scroll } from '@angular/router';
import { filter, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReloadScrollService {
  private readonly window = inject(DOCUMENT).defaultView;
  private readonly router = inject(Router);

  constructor() {
    const browser = this.window;
    if (!browser) return;
    const navigation = browser.performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const state = browser.history.state as { portfolioScrollPosition?: unknown } | null;
    const position = state?.portfolioScrollPosition;
    if (
      navigation?.type !== 'reload' ||
      !Array.isArray(position) ||
      position.length !== 2 ||
      !position.every((value: unknown) => typeof value === 'number' && Number.isFinite(value))
    )
      return;

    const [left, top] = position as [number, number];
    this.router.events
      .pipe(
        filter((event) => event instanceof Scroll),
        take(1),
      )
      .subscribe(() => {
        browser.requestAnimationFrame(() => browser.scrollTo({ left, top, behavior: 'instant' }));
      });
  }

  savePosition(): void {
    const browser = this.window;
    if (!browser) return;
    const state = browser.history.state as Record<string, unknown> | null;
    browser.history.replaceState(
      { ...state, portfolioScrollPosition: [browser.scrollX, browser.scrollY] },
      '',
    );
  }
}
