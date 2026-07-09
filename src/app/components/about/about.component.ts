import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideWebhook, lucideUsers, lucideTerminal, lucideCloud } from '@ng-icons/lucide';
import { Reveal } from '../../directives/reveal.directive';
import { RevealStagger } from '../../directives/reveal-stagger.directive';

interface Skill {
  label: string;
  img?: string;
  icon?: string;
  invertOnDark?: boolean;
}

@Component({
  selector: 'app-about',
  imports: [TranslatePipe, RouterLink, NgOptimizedImage, NgIconComponent, Reveal, RevealStagger],
  providers: [provideIcons({ lucideMapPin, lucideWebhook, lucideUsers, lucideTerminal, lucideCloud })],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  frontendSkills: Skill[] = [
    { label: 'HTML', img: '/img/skills/html.svg' },
    { label: 'CSS', img: '/img/skills/css.svg' },
    { label: 'JavaScript', img: '/img/skills/javascript.svg' },
    { label: 'TypeScript', img: '/img/skills/typescript.svg' },
    { label: 'Angular', img: '/img/skills/angular.svg' },
    { label: 'Supabase', img: '/img/skills/supabase.svg' },
    { label: 'Git', img: '/img/skills/git.svg' },
    { label: 'REST-API', icon: 'lucideWebhook' },
    { label: 'Scrum', icon: 'lucideUsers' },
    { label: 'Material Design', img: '/img/skills/materialdesign.svg' },
  ];

  learningSkills: Skill[] = [
    { label: 'Linux', img: '/img/skills/linux.svg' },
    { label: 'Terminal', icon: 'lucideTerminal' },
    { label: 'Python', img: '/img/skills/python.svg' },
    { label: 'Django', img: '/img/skills/django.svg', invertOnDark: true },
    { label: 'SQLite', img: '/img/skills/sqlite.svg' },
    { label: 'Redis', img: '/img/skills/redis.svg' },
    { label: 'PostgreSQL', img: '/img/skills/postgresql.svg' },
    { label: 'Docker', img: '/img/skills/docker.svg' },
    { label: 'Cloud', icon: 'lucideCloud' },
    { label: 'Heroku', img: '/img/skills/heroku.svg' },
  ];
}
