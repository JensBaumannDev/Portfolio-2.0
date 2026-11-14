import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MotionService } from '../../services/motion.service';

const EASE = 'cubic-bezier(0.22, 0.8, 0.2, 1)';
let introShown = false;

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe],
  host: { '(document:pointerdown)': 'skip()' },
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly motion = inject(MotionService);
  protected readonly step = signal(0);
  private readonly big = viewChild.required<ElementRef<HTMLElement>>('big');
  private readonly small = viewChild.required<ElementRef<HTMLElement>>('small');
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    afterNextRender(() => this.start());
    inject(DestroyRef).onDestroy(() => this.timers.forEach(clearTimeout));
  }

  protected skip(): void {
    if (this.step() < 3) this.finish();
  }

  private start(): void {
    if (this.motion.reduced() || introShown || window.scrollY > 10) {
      this.finish();
      return;
    }
    introShown = true;
    void document.fonts.ready.then(() => this.play());
  }

  private play(): void {
    if (this.step() >= 3) return;
    const big = this.big().nativeElement;
    const small = this.small().nativeElement;
    small.style.opacity = '0';
    big.style.filter = 'blur(16px)';
    big.style.transform = 'translate(-50%, -50%) scale(1.04)';
    void big.offsetWidth;
    this.at(200, () => {
      big.style.transition = `opacity .8s ${EASE}, filter .8s ${EASE}, transform 1.1s ${EASE}`;
      big.style.opacity = '1';
      big.style.filter = 'blur(0)';
      big.style.transform = 'translate(-50%, -50%)';
    });
    this.at(1250, () => {
      const target = small.getBoundingClientRect();
      const source = big.getBoundingClientRect();
      const dx = target.left + target.width / 2 - (source.left + source.width / 2);
      const dy = target.top + target.height / 2 - (source.top + source.height / 2);
      big.style.transition = `transform .95s ${EASE}, color .95s ${EASE}`;
      big.style.color = getComputedStyle(small).color;
      big.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${target.height / source.height})`;
      this.step.set(1);
    });
    this.at(1700, () => this.step.set(2));
    this.at(2150, () => this.step.set(3));
    this.at(2200, () => this.finish());
  }

  private finish(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    const big = this.big().nativeElement;
    big.style.transition = 'none';
    big.style.opacity = '0';
    this.small().nativeElement.style.opacity = '1';
    this.step.set(3);
  }

  private at(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }
}
