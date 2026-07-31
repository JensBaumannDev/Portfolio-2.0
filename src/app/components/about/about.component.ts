import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideChevronDown,
  lucideWebhook,
  lucideUsers,
  lucideTerminal,
  lucideCloud,
} from '@ng-icons/lucide';
import { Reveal } from '../../directives/reveal.directive';
import { RevealStagger } from '../../directives/reveal-stagger.directive';

interface Skill {
  label: string;
  img?: string;
  icon?: string;
  invertOnDark?: boolean;
}

interface StackGroup {
  key: string;
  skills: Skill[];
}

@Component({
  selector: 'app-about',
  imports: [TranslatePipe, RouterLink, NgOptimizedImage, NgIcon, Reveal, RevealStagger],
  providers: [
    provideIcons({
      lucideArrowRight,
      lucideChevronDown,
      lucideWebhook,
      lucideUsers,
      lucideTerminal,
      lucideCloud,
    }),
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  readonly facts = ['location', 'available', 'focus', 'languages'];

  protected readonly textExpanded = signal(false);

  protected toggleText(): void {
    this.textExpanded.update((expanded) => !expanded);
  }

  readonly stackGroups: StackGroup[] = [
    {
      key: 'frontend',
      skills: [
        { label: 'HTML', img: '/img/skills/html.svg' },
        { label: 'CSS', img: '/img/skills/css.svg' },
        { label: 'JavaScript', img: '/img/skills/javascript.svg' },
        { label: 'TypeScript', img: '/img/skills/typescript.svg' },
        { label: 'Angular', img: '/img/skills/angular.svg' },
        { label: 'Supabase', img: '/img/skills/supabase.svg' },
        { label: 'Git', img: '/img/skills/git.svg' },
        { label: 'REST-API', icon: 'lucideWebhook' },
        { label: 'Scrum', icon: 'lucideUsers' },
      ],
    },
    {
      key: 'backend',
      skills: [
        { label: 'Python', img: '/img/skills/python.svg' },
        { label: 'Django', img: '/img/skills/django.svg', invertOnDark: true },
        { label: 'PostgreSQL', img: '/img/skills/postgresql.svg' },
        { label: 'SQLite', img: '/img/skills/sqlite.svg' },
        { label: 'Docker', img: '/img/skills/docker.svg' },
        { label: 'Linux', img: '/img/skills/linux.svg' },
        { label: 'Terminal', icon: 'lucideTerminal' },
        { label: 'Cloud', icon: 'lucideCloud' },
      ],
    },
  ];
}
