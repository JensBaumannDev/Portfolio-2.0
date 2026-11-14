import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationScrollService {
  private readonly window = inject(DOCUMENT).defaultView;
  private readonly router = inject(Router);
  private trigger: NavigationStart['navigationTrigger'];

  constructor() {
    const browser = this.window;
    if (!browser) return;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.trigger = event.navigationTrigger;
        return;
      }
      if (!(event instanceof NavigationEnd) || this.trigger === 'popstate') return;
      if (this.router.parseUrl(event.urlAfterRedirects).fragment) return;
      browser.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    });
  }
}
