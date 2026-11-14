import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { SHOWCASE_PROJECTS } from '../../constants/showcase-projects.constants';
import { MotionService } from '../../services/motion.service';

@Component({
  selector: 'app-project-rail',
  imports: [NgIcon, NgOptimizedImage, RouterLink, TranslatePipe],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  templateUrl: './project-rail.html',
  styleUrl: './project-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectRail {
  private readonly motion = inject(MotionService);
  private readonly router = inject(Router);
  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');
  private framePending = false;
  private pointer = { x: 0, y: 0 };

  protected readonly projects = SHOWCASE_PROJECTS;
  protected readonly active = signal(0);
  protected readonly atStart = signal(true);
  protected readonly atEnd = signal(false);
  protected readonly lit = signal(false);

  constructor() {
    afterNextRender(() => this.sync());
  }

  protected sync(): void {
    const rail = this.rail().nativeElement;
    const atEnd = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 4;
    this.atStart.set(rail.scrollLeft < 4);
    this.atEnd.set(atEnd);
    this.active.set(atEnd ? this.projects.length - 1 : Math.round(rail.scrollLeft / this.step()));
  }

  protected move(direction: number): void {
    this.rail().nativeElement.scrollBy({
      left: direction * this.step(),
      behavior: this.motion.scrollBehavior(),
    });
  }

  protected goTo(index: number): void {
    this.rail().nativeElement.scrollTo({
      left: index * this.step(),
      behavior: this.motion.scrollBehavior(),
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.target !== this.rail().nativeElement) return;
    const direction = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (!direction) return;
    event.preventDefault();
    this.move(direction);
  }

  protected open(event: MouseEvent, slug: string): void {
    if (event.target instanceof Element && event.target.closest('a, button')) return;
    void this.router.navigate(['/projects', slug]);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    this.pointer = { x: event.clientX, y: event.clientY };
    this.lit.set(true);
    if (this.framePending) return;
    this.framePending = true;
    requestAnimationFrame(() => this.paintSheen());
  }

  private paintSheen(): void {
    this.framePending = false;
    for (const card of Array.from(this.rail().nativeElement.children)) {
      if (!(card instanceof HTMLElement)) continue;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${this.pointer.x - bounds.left}px`);
      card.style.setProperty('--my', `${this.pointer.y - bounds.top}px`);
    }
  }

  private step(): number {
    const [first, second] = Array.from(this.rail().nativeElement.children);
    return first instanceof HTMLElement && second instanceof HTMLElement
      ? second.offsetLeft - first.offsetLeft
      : 1;
  }
}
