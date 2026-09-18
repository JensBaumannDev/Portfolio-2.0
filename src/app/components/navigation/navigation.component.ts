import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  OnDestroy,
  input,
  output,
  computed,
  effect,
  ElementRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon, lucideMonitor } from '@ng-icons/lucide';
import { faBrandGithub, faBrandLinkedinIn, faBrandYoutube } from '@ng-icons/font-awesome/brands';
import { ThemeService } from '../../services/theme.service';
import { LanguageService, AppLanguage } from '../../services/language.service';
import { ScrollLockService } from '../../services/scroll-lock.service';

const SECTION_IDS = ['home', 'projects', 'about', 'contact'];
const MOBILE_MENU_MAX_WIDTH = 559;
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({
  selector: 'app-navigation',
  imports: [TranslatePipe, NgIcon, RouterLink],
  providers: [
    provideIcons({
      lucideSun,
      lucideMoon,
      lucideMonitor,
      faBrandGithub,
      faBrandLinkedinIn,
      faBrandYoutube,
    }),
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()',
    '(window:resize)': 'onWindowResize()',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class Navigation implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly scrollLock = inject(ScrollLockService);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly lockToken = Symbol('mobile-menu');
  private routeSub?: Subscription;
  private scrollRafId?: number;
  private focusTimerId?: ReturnType<typeof setTimeout>;
  private menuTrigger?: HTMLElement;

  readonly forceActive = input<string | undefined>(undefined);
  readonly linkClick = output<string>();

  protected readonly isMenuOpen = signal<boolean>(false);
  protected readonly isScrolled = signal<boolean>(false);
  protected readonly isLandingPage = signal<boolean>(true);
  protected readonly currentLang = this.languageService.current;
  protected readonly activeSection = signal<string>('home');
  protected readonly currentActiveSection = computed(
    () => this.forceActive() ?? (this.isLandingPage() ? this.activeSection() : '')
  );
  protected readonly themeMode = this.themeService.mode;

  ngOnInit(): void {
    this.checkRoute();

    this.routeSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    if (this.scrollRafId !== undefined) cancelAnimationFrame(this.scrollRafId);
    if (this.focusTimerId !== undefined) clearTimeout(this.focusTimerId);
    this.setBackgroundInert(false);
    this.scrollLock.release(this.lockToken);
  }

  private readonly menuScrollLock = effect(() => {
    const isOpen = this.isMenuOpen();
    this.setBackgroundInert(isOpen);

    if (isOpen) {
      this.scrollLock.lock(this.lockToken);
    } else {
      this.scrollLock.release(this.lockToken);
    }
  });

  protected toggleMenu(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
      return;
    }

    const activeElement = this.document.activeElement;
    this.menuTrigger = activeElement instanceof HTMLElement ? activeElement : undefined;
    this.isMenuOpen.set(true);
    this.clearFocusTimer();
    this.focusTimerId = setTimeout(() => {
      this.focusTimerId = undefined;
      this.menuFocusableElements()[0]?.focus();
    });
  }

  protected closeMenu(restoreFocus = false): void {
    if (!this.isMenuOpen()) return;
    this.clearFocusTimer();
    this.isMenuOpen.set(false);

    if (restoreFocus && this.menuTrigger) {
      const trigger = this.menuTrigger;
      this.focusTimerId = setTimeout(() => {
        this.focusTimerId = undefined;
        trigger.focus();
      });
    }

    this.menuTrigger = undefined;
  }

  protected onEscape(): void {
    this.closeMenu(true);
  }

  protected trapMenuFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.isMenuOpen()) return;

    const elements = this.menuFocusableElements();
    if (!elements.length) return;

    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = this.document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }

  protected changeLanguage(lang: AppLanguage): void {
    this.languageService.use(lang);
  }

  protected setActiveSection(section: string): void {
    this.activeSection.set(section);
    this.linkClick.emit(section);
  }

  protected onWindowScroll(): void {
    if (this.scrollRafId !== undefined) return;
    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = undefined;
      this.updateScrollState();
    });
  }

  protected onWindowResize(): void {
    if (window.innerWidth > MOBILE_MENU_MAX_WIDTH) this.closeMenu();
  }

  private menuFocusableElements(): HTMLElement[] {
    const menu = this.host.nativeElement.querySelector<HTMLElement>('.mobile-menu');
    return menu ? Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
  }

  private clearFocusTimer(): void {
    if (this.focusTimerId === undefined) return;
    clearTimeout(this.focusTimerId);
    this.focusTimerId = undefined;
  }

  private setBackgroundInert(inert: boolean): void {
    if (this.host.nativeElement.closest('dialog')) return;

    for (const element of this.document.querySelectorAll<HTMLElement>('#main-content, app-footer')) {
      element.inert = inert;
    }
  }

  private checkRoute(): void {
    const url = this.router.url;
    const isLanding = url === '/' || url.startsWith('/#') || url.startsWith('/?');
    this.isLandingPage.set(isLanding);
    this.updateScrollState();
  }

  private updateScrollState(): void {
    this.isScrolled.set(window.scrollY > 0);

    if (!this.isLandingPage()) return;

    let activeId = 'home';
    const navbarHeight =
      this.host.nativeElement.querySelector('.navbar')?.getBoundingClientRect().height ?? 0;

    for (const id of SECTION_IDS) {
      const element = this.document.getElementById(id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      if (rect.top <= navbarHeight && rect.bottom > navbarHeight) {
        activeId = id;
        break;
      }

      if (rect.bottom <= navbarHeight) {
        activeId = id;
      }
    }

    this.activeSection.set(activeId);
  }
}
