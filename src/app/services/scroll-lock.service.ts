import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const LOCK_CLASS = 'no-scroll';

@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private readonly document = inject(DOCUMENT);
  private holders = new Set<symbol>();

  lock(holder: symbol): void {
    this.holders.add(holder);
    this.apply();
  }

  release(holder: symbol): void {
    this.holders.delete(holder);
    this.apply();
  }

  private apply(): void {
    const locked = this.holders.size > 0;
    for (const element of [this.document.documentElement, this.document.body]) {
      element?.classList.toggle(LOCK_CLASS, locked);
    }
  }
}
