import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faBrandGithub, faBrandLinkedinIn, faBrandYoutube } from '@ng-icons/font-awesome/brands';
import { LanguageService, AppLanguage } from '../../services/language.service';
import { ThemeMode, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navigation',
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenus()',
  },
  imports: [NgIcon, NgOptimizedImage, RouterLink, TranslatePipe],
  providers: [provideIcons({ faBrandGithub, faBrandLinkedinIn, faBrandYoutube })],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navigation implements OnDestroy {
  protected readonly language = inject(LanguageService);
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly languageMenuOpen = signal(false);
  protected readonly themeMenuOpen = signal(false);
  protected readonly navigationMenuOpen = signal(false);
  protected readonly currentLanguage = computed(() => this.language.current() ?? 'en');
  protected readonly isScrolling = signal(false);
  protected readonly hasScrolled = signal(false);
  private previousScrollY = 0;
  private scrollIdleTimer: number | undefined;

  ngOnDestroy(): void {
    window.clearTimeout(this.scrollIdleTimer);
  }

  protected toggleLanguageMenu(): void {
    this.languageMenuOpen.update((open) => !open);
    this.themeMenuOpen.set(false);
  }

  protected toggleThemeMenu(): void {
    this.themeMenuOpen.update((open) => !open);
    this.languageMenuOpen.set(false);
  }

  protected changeTheme(mode: ThemeMode): void {
    this.theme.setThemeMode(mode);
    this.themeMenuOpen.set(false);
  }

  protected changeMobileTheme(event: Event): void {
    const value = event.target instanceof HTMLSelectElement ? event.target.value : null;
    if (value === 'system' || value === 'light' || value === 'dark') this.changeTheme(value);
  }

  protected changeMobileLanguage(event: Event): void {
    const value = event.target instanceof HTMLSelectElement ? event.target.value : null;
    if (value === 'de' || value === 'en') this.changeLanguage(value);
  }

  protected toggleNavigationMenu(): void {
    this.navigationMenuOpen.update((open) => !open);
    this.languageMenuOpen.set(false);
    this.themeMenuOpen.set(false);
  }

  protected closeNavigationMenu(): void {
    this.navigationMenuOpen.set(false);
  }

  protected closeMenus(): void {
    this.navigationMenuOpen.set(false);
    this.languageMenuOpen.set(false);
    this.themeMenuOpen.set(false);
  }

  protected changeLanguage(language: AppLanguage): void {
    this.language.use(language);
    this.languageMenuOpen.set(false);
    this.themeMenuOpen.set(false);
    this.navigationMenuOpen.set(false);
  }

  protected scrollToSection(event: MouseEvent, section: string): void {
    event.preventDefault();
    this.navigationMenuOpen.set(false);
    const target = document.getElementById(section);
    if (!target) {
      void this.router.navigate(['/'], { fragment: section, scroll: 'manual' }).then((navigated) => {
        if (navigated) requestAnimationFrame(() => this.scrollToTarget(section));
      });
      return;
    }

    window.history.pushState(null, '', `#${section}`);
    this.scrollToTarget(section);
  }

  private scrollToTarget(section: string): void {
    const target = document.getElementById(section);
    if (!target) return;

    const offset = section === 'about' || section === 'skills' ? 96 : 0;
    window.scrollTo({
      top: section === 'home' ? 0 : Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset),
      behavior: 'smooth',
    });
  }

  protected onDocumentClick(event: Event): void {
    const target = event.target;
    if (target instanceof Element && this.elementRef.nativeElement.contains(target)) return;

    this.languageMenuOpen.set(false);
    this.themeMenuOpen.set(false);
    this.navigationMenuOpen.set(false);
  }

  protected onScroll(): void {
    this.languageMenuOpen.set(false);
    this.themeMenuOpen.set(false);
    this.navigationMenuOpen.set(false);
    const currentScrollY = window.scrollY;
    this.hasScrolled.set(currentScrollY > 0);
    window.clearTimeout(this.scrollIdleTimer);
    if (currentScrollY <= 0 || currentScrollY < this.previousScrollY) {
      this.isScrolling.set(false);
    } else if (currentScrollY > this.previousScrollY) {
      this.isScrolling.set(true);
    }
    this.previousScrollY = currentScrollY;
    if (this.isScrolling()) {
      this.scrollIdleTimer = window.setTimeout(() => this.isScrolling.set(false), 700);
    }
  }
}
