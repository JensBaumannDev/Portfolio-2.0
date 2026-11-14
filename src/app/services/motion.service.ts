import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MotionService {
  reduced(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  scrollBehavior(): ScrollBehavior {
    return this.reduced() ? 'instant' : 'smooth';
  }
}
