import {
  ChangeDetectionStrategy,
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { malt } from '../../icons/malt';
import { faBrandGithub, faBrandLinkedinIn } from '@ng-icons/font-awesome/brands';
import { lucideGlobe } from '@ng-icons/lucide';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, AppLanguage } from '../../services/language.service';
@Component({
  selector: 'app-navigation',
  imports: [TranslatePipe, NgIcon, RouterLink],
  providers: [provideIcons({ faBrandGithub, faBrandLinkedinIn, malt, lucideGlobe })],
  host: {
    '(document:pointerdown)': 'pointerInteraction.set(true)',
    '(document:keydown)': 'pointerInteraction.set(false)',
    '(document:keydown.escape)': 'closeNavigationMenu()',
    '(document:click)': 'onDocumentClick($event)',
    '(window:scroll)': 'onScroll()',
    '(focusin)': 'showNavigation()',
  },
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navigation {
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private lastScrollY = 0;
  private navigationTimer: ReturnType<typeof setTimeout> | undefined;
  protected readonly currentLanguage = computed(() => this.language.current() ?? 'en');
  protected readonly navigationMenuOpen = signal(false);
  protected readonly menuClosing = signal(false);
  protected readonly menuAnimatedOpen = signal(false);
  protected readonly activeSection = signal<string | null>(null);
  protected readonly pointerInteraction = signal(false);
  protected readonly navigationHidden = signal(false);

  constructor() {
    afterNextRender(() => {
      this.lastScrollY = Math.max(0, window.scrollY);
      this.updateActiveSection();
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.navigationTimer));
  }

  protected onScroll(): void {
    this.updateActiveSection();
    const scrollY = Math.max(0, window.scrollY);
    const direction = scrollY - this.lastScrollY;
    this.lastScrollY = scrollY;
    if (direction === 0) return;
    this.showNavigation();
    if (
      direction < 0 ||
      scrollY <= this.elementRef.nativeElement.offsetHeight ||
      this.navigationMenuOpen() ||
      (!this.pointerInteraction() && this.elementRef.nativeElement.contains(document.activeElement))
    )
      return;
    this.navigationHidden.set(true);
    this.navigationTimer = setTimeout(() => this.showNavigation(), 400);
  }

  protected showNavigation(): void {
    clearTimeout(this.navigationTimer);
    this.navigationTimer = undefined;
    this.navigationHidden.set(false);
  }

  protected updateActiveSection(): void {
    if (this.router.url.split(/[?#]/)[0] !== '/') {
      this.activeSection.set(null);
      return;
    }
    let active = 'home';
    for (const section of ['home', 'skills', 'projects', 'about', 'contact']) {
      const target = document.getElementById(section);
      if (target && target.getBoundingClientRect().top <= window.innerHeight * 0.3)
        active = section;
    }
    this.activeSection.set(active);
  }
  protected toggleNavigationMenu(): void {
    this.showNavigation();
    if (this.navigationMenuOpen()) {
      this.closeNavigationMenu();
      return;
    }
    this.navigationMenuOpen.set(true);
    requestAnimationFrame(() => {
      this.elementRef.nativeElement.querySelector<HTMLDialogElement>('.mobile-dialog')?.showModal();
      requestAnimationFrame(() => {
        if (this.navigationMenuOpen() && !this.menuClosing()) this.menuAnimatedOpen.set(true);
      });
    });
  }
  protected async closeNavigationMenu(): Promise<void> {
    if (!this.navigationMenuOpen() || this.menuClosing()) return;
    this.menuClosing.set(true);
    this.menuAnimatedOpen.set(false);
    const dialog = this.elementRef.nativeElement.querySelector<HTMLDialogElement>('.mobile-dialog');
    if (dialog && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const style = getComputedStyle(dialog);
      const start = { opacity: style.opacity, transform: style.transform };
      dialog.getAnimations().forEach((animation) => animation.cancel());
      await dialog
        .animate([start, { opacity: 0, transform: 'translateY(-16px)' }], {
          duration: 240,
          easing: 'cubic-bezier(0.4, 0, 1, 1)',
          fill: 'forwards',
        })
        .finished.catch(() => undefined);
    }
    dialog?.close();
    this.navigationMenuOpen.set(false);
    this.menuClosing.set(false);
    this.elementRef.nativeElement.querySelector<HTMLButtonElement>('.menu-trigger')?.focus();
  }
  protected changeLanguage(language: AppLanguage): void {
    this.language.use(language);
    this.closeNavigationMenu();
  }
  protected onDocumentClick(event: Event): void {
    if (event.target instanceof Element && !this.elementRef.nativeElement.contains(event.target))
      this.closeNavigationMenu();
  }
  protected async scrollToSection(event: MouseEvent, section: string): Promise<void> {
    event.preventDefault();
    this.activeSection.set(section);
    await this.closeNavigationMenu();
    if (!document.getElementById(section)) {
      void this.router
        .navigate(['/'], { fragment: section, scroll: 'manual' })
        .then((navigated) => {
          if (navigated) requestAnimationFrame(() => this.scrollToTarget(section));
        });
      return;
    }
    window.history.pushState(null, '', '#' + section);
    this.scrollToTarget(section);
  }
  private scrollToTarget(section: string): void {
    const target = document.getElementById(section);
    if (!target) return;
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
  }
}
