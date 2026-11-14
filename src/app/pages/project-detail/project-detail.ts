import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideX } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHero } from '../../components/page-hero/page-hero';
import { SHOWCASE_PROJECTS, ShowcaseProject } from '../../constants/showcase-projects.constants';
import { TECHNOLOGY_ICONS } from '../../constants/technologies.constants';
import { SeoService } from '../../services/seo.service';
import { MotionService } from '../../services/motion.service';

const MOVERS =
  'app-page-hero .label, app-page-hero h1, app-page-hero .sub, .pj-btns, .pj-mock, .pj-sum';

@Component({
  selector: 'app-project-detail',
  imports: [NgIcon, NgOptimizedImage, PageHero, RouterLink, TranslatePipe],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucideX })],
  host: { '(document:keydown)': 'onKeydown($event)' },
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail {
  private readonly motion = inject(MotionService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private requested: { project: ShowcaseProject; direction: number } | undefined;
  private transitioning = false;
  private destroyed = false;
  private animations: Animation[] = [];

  readonly slug = input.required<string>();
  protected readonly projects = SHOWCASE_PROJECTS;
  protected readonly icons = TECHNOLOGY_ICONS;
  protected readonly displayed = signal<ShowcaseProject | undefined>(undefined);
  protected readonly zoomed = signal<ShowcaseProject | undefined>(undefined);
  private readonly shot = viewChild.required<ElementRef<HTMLDialogElement>>('shot');
  protected direction = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.animations.forEach((animation) => animation.cancel());
      this.animations = [];
    });
    effect(() => {
      const slug = this.slug();
      untracked(() => this.show(slug));
    });
  }

  protected openShot(project: ShowcaseProject): void {
    this.zoomed.set(project);
    this.shot().nativeElement.showModal();
  }

  protected closeShot(): void {
    this.shot().nativeElement.close();
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeShot();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.shot().nativeElement.open) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select')) return;
    const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    const current = this.find(this.slug()) ?? this.displayed();
    if (!step || !current) return;
    event.preventDefault();
    this.direction = step;
    void this.router.navigate(['/projects', this.neighbour(current, step).slug]);
  }

  protected neighbour(project: ShowcaseProject, step: number): ShowcaseProject {
    const count = this.projects.length;
    return this.projects[(this.projects.indexOf(project) + step + count) % count];
  }

  private show(slug: string): void {
    const target = this.find(slug);
    if (!target) {
      void this.router.navigate(['/not-found'], { skipLocationChange: true });
      return;
    }
    this.seo.apply({
      titleKey: 'work.labels.seo_title',
      descriptionKey: `work.${target.slug}.summary`,
      path: `/projects/${target.slug}`,
      params: { name: target.name },
    });
    const from = this.displayed();
    if (!from) {
      this.displayed.set(target);
      return;
    }
    const direction =
      this.direction || (this.projects.indexOf(target) > this.projects.indexOf(from) ? 1 : -1);
    this.direction = 0;
    this.requested = { project: target, direction };
    this.runTransition();
  }

  private runTransition(): void {
    const request = this.requested;
    if (this.destroyed || this.transitioning || !request || request.project === this.displayed())
      return;
    if (this.motion.reduced()) {
      this.displayed.set(request.project);
      return;
    }
    this.transitioning = true;
    void this.transitionTo(request.direction)
      .catch(() => {
        if (this.destroyed) return;
        this.displayed.set(this.requested?.project ?? this.displayed());
        this.changeDetector.detectChanges();
      })
      .finally(() => {
        this.animations.forEach((animation) => animation.cancel());
        this.animations = [];
        this.transitioning = false;
        this.runTransition();
      });
  }

  private async transitionTo(direction: number): Promise<void> {
    const from = this.displayed();
    if (!from) return;
    const outgoing = this.animate(from, direction, false);
    this.animations = outgoing;
    await Promise.all(outgoing.map((animation) => animation.finished));
    if (this.destroyed) return;
    const request = this.requested;
    if (!request) return;
    const incomingDirection = request.project === from ? -direction : request.direction;
    this.displayed.set(request.project);
    this.changeDetector.detectChanges();
    const incoming = this.animate(request.project, incomingDirection, true);
    outgoing.forEach((animation) => animation.cancel());
    this.animations = incoming;
    await Promise.all(incoming.map((animation) => animation.finished));
  }

  private animate(project: ShowcaseProject, direction: number, entering: boolean): Animation[] {
    const panel = this.host.nativeElement.querySelector(`[data-project="${project.slug}"]`);
    const elements = panel?.querySelectorAll<HTMLElement>(MOVERS) ?? [];
    return Array.from(elements, (element) =>
      element.animate(
        entering
          ? [
              { transform: `translateX(${direction * 120}px)`, opacity: 0 },
              { transform: 'none', opacity: 1 },
            ]
          : [
              { transform: 'none', opacity: 1 },
              { transform: `translateX(${-direction * 120}px)`, opacity: 0 },
            ],
        {
          duration: entering ? 420 : 220,
          delay: entering && element.matches('.pj-mock') ? 40 : 0,
          easing: entering ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' : 'cubic-bezier(0.4, 0, 1, 1)',
          fill: 'both',
        },
      ),
    );
  }

  private find(slug: string): ShowcaseProject | undefined {
    return this.projects.find((project) => project.slug === slug);
  }
}
