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
  selector: '[appReveal]',
  host: {
    class: 'reveal',
  },
})
export class Reveal implements AfterViewInit, OnDestroy {
  readonly revealDelay = input(0);
  readonly revealThreshold = input(0.15);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement as HTMLElement;

    if (this.revealDelay() > 0) {
      this.renderer.setStyle(element, '--reveal-delay', `${this.revealDelay()}ms`);
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      this.show(element);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.show(element);
            this.observer?.disconnect();
          }
        }
      },
      { threshold: this.revealThreshold() }
    );

    this.observer.observe(element);
  }

  private show(element: HTMLElement): void {
    this.renderer.addClass(element, 'reveal--visible');
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
