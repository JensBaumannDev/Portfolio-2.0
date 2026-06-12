import { Component, signal, ChangeDetectionStrategy, inject, ElementRef, AfterViewInit, effect } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LucideSettings, LucideSun, LucideMoonStar, LucideMonitor } from '@lucide/angular';

interface NavItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-navigation',
  imports: [NgOptimizedImage, LucideSettings, LucideSun, LucideMoonStar, LucideMonitor],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()',
    '(window:resize)': 'onWindowResize()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class Navigation implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);

  protected readonly developerName = signal('Jens Baumann');
  protected readonly developerTitle = signal('Fullstack Developer');
  protected readonly avatarUrl = signal('img/profile/Logo-Photoroom.png');
  protected readonly activeSection = signal('home');
  protected readonly isMobileMenuOpen = signal(false);

  protected readonly selectedTheme = signal<'light' | 'dark' | 'system'>('system');

  constructor() {
    effect((onCleanup) => {
      const theme = this.selectedTheme();
      if (typeof window !== 'undefined') {
        const updateTheme = () => {
          const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
          if (isDark) {
            document.body.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
          }
        };

        updateTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = () => {
          if (this.selectedTheme() === 'system') {
            updateTheme();
          }
        };

        mediaQuery.addEventListener('change', listener);
        onCleanup(() => {
          mediaQuery.removeEventListener('change', listener);
        });
      }
    });
  }

  protected readonly currentLang = signal<'de' | 'en'>('de');
  protected readonly isSettingsOpen = signal(false);

  protected readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ]);

  protected readonly activeLeft = signal(0);
  protected readonly activeWidth = signal(0);



  ngAfterViewInit(): void {
    this.updateActiveIndicator();
  }

  private updateActiveIndicator(): void {
    setTimeout(() => {
      const container = this.elementRef.nativeElement as HTMLElement;
      const activeEl = container.querySelector('.desktop-nav .nav-item.active') as HTMLElement;
      if (activeEl) {
        this.activeLeft.set(activeEl.offsetLeft);
        this.activeWidth.set(activeEl.offsetWidth);
      }
    }, 0);
  }

  protected onWindowResize(): void {
    this.updateActiveIndicator();
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  protected toggleSettings(): void {
    this.isSettingsOpen.update((open) => !open);
  }

  protected setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.selectedTheme.set(theme);
  }

  protected setLang(lang: 'de' | 'en'): void {
    this.currentLang.set(lang);
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.tablet-settings')) {
      this.isSettingsOpen.set(false);
    }
  }

  protected scrollTo(sectionId: string): void {
    this.isMobileMenuOpen.set(false);
    this.activeSection.set(sectionId);

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 90;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  protected onWindowScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const navHeight = 110;

    const items = this.navItems();
    const container = this.elementRef.nativeElement as HTMLElement;
    const buttons = Array.from(container.querySelectorAll('.desktop-nav .nav-item')) as HTMLElement[];

    if (buttons.length !== items.length) {
      for (let i = items.length - 1; i >= 0; i--) {
        const sectionId = items[i].id;
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop - navHeight;
          if (scrollPosition >= top) {
            this.activeSection.set(sectionId);
            break;
          }
        }
      }
      return;
    }

    const sections = items.map((item, idx) => {
      const element = document.getElementById(item.id);
      const btn = buttons[idx];
      return {
        id: item.id,
        top: item.id === 'home' ? 0 : (element ? element.offsetTop - navHeight : 0),
        left: btn.offsetLeft,
        width: btn.offsetWidth
      };
    });

    let currentIdx = 0;
    for (let i = sections.length - 1; i >= 0; i--) {
      if (scrollPosition >= sections[i].top) {
        currentIdx = i;
        break;
      }
    }

    this.activeSection.set(sections[currentIdx].id);

    if (currentIdx < sections.length - 1) {
      const current = sections[currentIdx];
      const next = sections[currentIdx + 1];
      const range = next.top - current.top;
      if (range > 0) {
        const progress = Math.max(0, Math.min(1, (scrollPosition - current.top) / range));
        this.activeLeft.set(current.left + progress * (next.left - current.left));
        this.activeWidth.set(current.width + progress * (next.width - current.width));
      } else {
        this.activeLeft.set(current.left);
        this.activeWidth.set(current.width);
      }
    } else {
      const current = sections[currentIdx];
      this.activeLeft.set(current.left);
      this.activeWidth.set(current.width);
    }
  }
}
