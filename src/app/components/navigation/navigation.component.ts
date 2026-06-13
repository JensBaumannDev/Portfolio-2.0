import { Component, ChangeDetectionStrategy, signal, inject, OnInit, OnDestroy, input, output, computed } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

const BRAND_TEXT = '</Jens Baumann>';
const TYPEWRITER_DELAY_MS = 1751;
const TYPEWRITER_SPEED_MS = 75;

type SectionTheme = 'light' | 'dark';

const SECTION_THEMES: Record<string, SectionTheme> = {
  home: 'light',
  about: 'dark',
  projects: 'light',
  skills: 'dark',
  contact: 'light',
};

const SECTION_ORDER = Object.keys(SECTION_THEMES);

@Component({
  selector: 'app-navigation',
  imports: [TranslatePipe],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class Navigation implements OnInit, OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private typewriterTimeout?: ReturnType<typeof setTimeout>;
  private typewriterInterval?: ReturnType<typeof setInterval>;
  private routeSub?: Subscription;
  private scrollRafId?: number;

  readonly forceLight = input(false);
  readonly forceActive = input<string | undefined>(undefined);
  readonly linkClick = output<string>();

  protected readonly isMenuOpen = signal<boolean>(false);
  protected readonly isScrolled = signal<boolean>(false);
  protected readonly isPastHero = signal<boolean>(false);
  protected readonly isLandingPage = signal<boolean>(true);
  protected readonly currentLang = this.translate.currentLang;
  protected readonly activeSection = signal<string>('home');
  protected readonly currentActiveSection = computed(() => this.forceActive() ?? this.activeSection());
  protected readonly brandText = signal<string>('');
  protected readonly isTypingDone = signal<boolean>(false);

  constructor() {
    this.translate.use('de');
  }

  ngOnInit(): void {
    this.startTypewriter();
    this.checkRoute();

    this.routeSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.typewriterTimeout);
    clearInterval(this.typewriterInterval);
    this.routeSub?.unsubscribe();
    if (this.scrollRafId !== undefined) cancelAnimationFrame(this.scrollRafId);
  }

  private startTypewriter(): void {
    if (typeof window === 'undefined') {
      this.brandText.set(BRAND_TEXT);
      this.isTypingDone.set(true);
      return;
    }

    this.typewriterTimeout = setTimeout(() => {
      let index = 0;
      this.typewriterInterval = setInterval(() => {
        index++;
        this.brandText.set(BRAND_TEXT.slice(0, index));
        if (index >= BRAND_TEXT.length) {
          clearInterval(this.typewriterInterval);
          this.isTypingDone.set(true);
        }
      }, TYPEWRITER_SPEED_MS);
    }, TYPEWRITER_DELAY_MS);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((val) => !val);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected changeLanguage(lang: string): void {
    this.translate.use(lang);
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

  private checkRoute(): void {
    if (typeof window === 'undefined') return;
    const url = this.router.url;
    const isLanding = url === '/' || url.startsWith('/#') || url.startsWith('/?');
    this.isLandingPage.set(isLanding);
    this.updateScrollState();
  }

  private updateScrollState(): void {
    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY;
    this.isScrolled.set(scrollY > 0);

    if (!this.isLandingPage()) {
      this.isPastHero.set(true);
      return;
    }

    const navbarHeight = 65;
    let theme: SectionTheme = SECTION_THEMES['home'];
    let activeId = 'home';

    for (const id of SECTION_ORDER) {
      const element = document.getElementById(id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      if (rect.top <= navbarHeight && rect.bottom > navbarHeight) {
        theme = SECTION_THEMES[id];
        activeId = id;
        break;
      }

      if (rect.bottom <= navbarHeight) {
        theme = SECTION_THEMES[id];
        activeId = id;
      }
    }

    this.isPastHero.set(theme === 'light');
    this.activeSection.set(activeId);
  }
}