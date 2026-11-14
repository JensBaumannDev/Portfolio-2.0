import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faBrandGithub, faBrandLinkedin } from '@ng-icons/font-awesome/brands';
import { lucideGlobe } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { MALT_ICON, SOCIAL_LINKS } from '../../constants/site.constants';
import { AppLanguage, LanguageService } from '../../services/language.service';
import { MotionService } from '../../services/motion.service';

interface NavLink {
  readonly section: string;
  readonly labelKey: string;
}

@Component({
  selector: 'app-navigation',
  imports: [NgIcon, RouterLink, TranslatePipe],
  providers: [provideIcons({ faBrandGithub, faBrandLinkedin, lucideGlobe, maltIcon: MALT_ICON })],
  host: {
    '(document:keydown.escape)': 'menuOpen.set(false)',
    '(document:click)': 'onDocumentClick($event)',
  },
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navigation {
  private readonly motion = inject(MotionService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly language = inject(LanguageService);
  protected readonly menuOpen = signal(false);
  protected readonly otherLanguage = computed<AppLanguage>(() =>
    this.language.current() === 'en' ? 'de' : 'en',
  );
  protected readonly socials = SOCIAL_LINKS;
  protected readonly links: readonly NavLink[] = [
    { section: 'projects', labelKey: 'nav.projects' },
    { section: 'about', labelKey: 'nav.about' },
    { section: 'skills', labelKey: 'nav.skills' },
    { section: 'contact', labelKey: 'nav.contact' },
  ];

  protected switchLanguage(): void {
    this.language.use(this.otherLanguage());
    this.menuOpen.set(false);
  }

  protected onDocumentClick(event: Event): void {
    if (event.target instanceof Node && !this.host.nativeElement.contains(event.target))
      this.menuOpen.set(false);
  }

  protected goTo(event: MouseEvent, section: string | null): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    this.menuOpen.set(false);
    const onHome = this.router.url.split(/[?#]/)[0] === '/';
    if (!onHome) {
      void this.router
        .navigate(['/'], section ? { fragment: section } : {})
        .then(() => requestAnimationFrame(() => this.scrollTo(section)));
      return;
    }
    window.history.replaceState(window.history.state, '', section ? '/#' + section : '/');
    this.scrollTo(section);
  }

  private scrollTo(section: string | null): void {
    const behavior = this.motion.scrollBehavior();
    if (!section) {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    document.getElementById(section)?.scrollIntoView({ behavior, block: 'start' });
  }
}
