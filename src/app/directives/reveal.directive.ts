import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, signal } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  host: {
    'class': 'reveal-item',
    '[class.is-revealed]': 'visible()',
    '(focusin)': 'reveal()',
  },
})
export class RevealDirective implements AfterViewInit {
  protected readonly visible = signal(false);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;

  constructor() {
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.reveal();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) this.reveal();
    }, { threshold: 0.08 });
    this.observer.observe(this.element.nativeElement);
  }

  protected reveal(): void {
    this.visible.set(true);
    this.observer?.disconnect();
  }
}
