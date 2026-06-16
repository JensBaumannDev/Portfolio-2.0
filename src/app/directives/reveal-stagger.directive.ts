import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appRevealStagger]',
})
export class RevealStagger implements AfterViewInit, OnDestroy {
  readonly revealSelector = input('');
  readonly revealStep = input(110);
  readonly revealThreshold = input(0.15);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const host = this.elementRef.nativeElement as HTMLElement;
    const targets = this.resolveTargets(host);

    targets.forEach((target, index) => {
      this.renderer.addClass(target, 'reveal');
      this.renderer.setStyle(target, '--reveal-delay', `${index * this.revealStep()}ms`);
    });

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      this.reveal(targets);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.reveal(targets);
            this.observer?.disconnect();
          }
        }
      },
      { threshold: this.revealThreshold() }
    );

    this.observer.observe(host);
  }

  private resolveTargets(host: HTMLElement): HTMLElement[] {
    const selector = this.revealSelector();
    if (selector) {
      return Array.from(host.querySelectorAll<HTMLElement>(selector));
    }
    return Array.from(host.children) as HTMLElement[];
  }

  private reveal(targets: HTMLElement[]): void {
    for (const target of targets) {
      this.renderer.addClass(target, 'reveal--visible');
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
