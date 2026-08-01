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
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon, lucideMonitor } from '@ng-icons/lucide';
import { ThemeService } from '../../services/theme.service';
import { LanguageService, AppLanguage } from '../../services/language.service';
import { ScrollLockService } from '../../services/scroll-lock.service';
import { NAVBAR_HEIGHT } from '../../constants/layout.constants';

const SECTION_IDS = ['home', 'projects', 'about', 'contact'];

@Component({
  selector: 'app-navigation',
  imports: [TranslatePipe, NgIcon],
  providers: [provideIcons({ lucideSun, lucideMoon, lucideMonitor })],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class Navigation implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly scrollLock = inject(ScrollLockService);
  private readonly document = inject(DOCUMENT);
  private readonly lockToken = Symbol('mobile-menu');
  private routeSub?: Subscription;
  private scrollRafId?: number;

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
    this.scrollLock.release(this.lockToken);
  }

  private readonly menuScrollLock = effect(() => {
    if (this.isMenuOpen()) {
      this.scrollLock.lock(this.lockToken);
    } else {
      this.scrollLock.release(this.lockToken);
    }
  });

  protected toggleMenu(): void {
    this.isMenuOpen.update((val) => !val);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
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

    for (const id of SECTION_IDS) {
      const element = this.document.getElementById(id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      if (rect.top <= NAVBAR_HEIGHT && rect.bottom > NAVBAR_HEIGHT) {
        activeId = id;
        break;
      }

      if (rect.bottom <= NAVBAR_HEIGHT) {
        activeId = id;
      }
    }

    this.activeSection.set(activeId);
  }
}
