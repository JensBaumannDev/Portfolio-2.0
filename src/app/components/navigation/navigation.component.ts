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
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon } from '@ng-icons/lucide';
import { ThemeService } from '../../services/theme.service';

const SECTION_IDS = ['home', 'projects', 'about', 'skills', 'contact'];

@Component({
  selector: 'app-navigation',
  imports: [TranslatePipe, NgIconComponent],
  providers: [provideIcons({ lucideSun, lucideMoon })],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class Navigation implements OnInit, OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private routeSub?: Subscription;
  private scrollRafId?: number;

  readonly forceActive = input<string | undefined>(undefined);
  readonly linkClick = output<string>();

  protected readonly isMenuOpen = signal<boolean>(false);
  protected readonly isScrolled = signal<boolean>(false);
  protected readonly isLandingPage = signal<boolean>(true);
  protected readonly currentLang = this.translate.currentLang;
  protected readonly activeSection = signal<string>('home');
  protected readonly currentActiveSection = computed(
    () => this.forceActive() ?? (this.isLandingPage() ? this.activeSection() : '')
  );
  protected readonly isDark = computed(() => this.themeService.theme() === 'dark');

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
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((val) => !val);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }

  protected changeLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
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

    const navbarHeight = 73;
    let activeId = 'home';

    for (const id of SECTION_IDS) {
      const element = document.getElementById(id);
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
