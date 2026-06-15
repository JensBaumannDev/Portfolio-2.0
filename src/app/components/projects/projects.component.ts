import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideExternalLink } from '@ng-icons/lucide';
import { ProjectDialog } from './project-dialog/project-dialog.component';

export interface Project {
  key: string;
  tile: string;
  spotlight: boolean;
  tags: string[];
  image: string;
  imageAlt: string;
  github: string;
  live: string;
}

@Component({
  selector: 'app-projects',
  imports: [NgOptimizedImage, TranslatePipe, NgIcon, ProjectDialog],
  providers: [
    provideIcons({
      lucideGithub,
      lucideExternalLink,
    })
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  protected readonly projects = signal<Project[]>([
    {
      key: 'dabubble',
      tile: 'tile-dabubble',
      spotlight: true,
      tags: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
      image: './img/projects/webp/dabubble_project.webp',
      imageAlt: 'DABubble Project',
      github: 'https://github.com/JensBaumannDev/DABubble',
      live: 'https://jensbaumann.com/projects/dabubble',
    },
    {
      key: 'el_pollo_loco',
      tile: 'tile-pollo',
      spotlight: false,
      tags: ['HTML', 'CSS', 'JavaScript'],
      image: './img/projects/webp/el_pollo_loco_project.webp',
      imageAlt: 'El Pollo Loco Game',
      github: 'https://github.com/JensBaumannDev/El-Pollo-Loco',
      live: 'https://jensbaumann.com/projects/el_pollo_loco/',
    },
    {
      key: 'pokedex',
      tile: 'tile-pokedex',
      spotlight: false,
      tags: ['HTML', 'CSS', 'JavaScript', 'API'],
      image: './img/projects/webp/pokedex_project.webp',
      imageAlt: 'Pokedex Project',
      github: 'https://github.com/JensBaumannDev/Pokedex',
      live: 'https://jensbaumann.com/projects/pokedex/',
    },
    {
      key: 'join',
      tile: 'tile-join',
      spotlight: true,
      tags: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
      image: './img/projects/webp/join_project.webp',
      imageAlt: 'Join Project',
      github: 'https://github.com/JensBaumannDev/Join',
      live: 'https://jensbaumann.com/projects/join/',
    },
    {
      key: 'portfolio',
      tile: 'tile-portfolio',
      spotlight: false,
      tags: ['Angular', 'TypeScript', 'SCSS'],
      image: './img/projects/webp/portfolio_project.webp',
      imageAlt: 'Portfolio Website',
      github: 'https://github.com/JensBaumannDev/Portfolio',
      live: 'https://jensbaumann.com/projects/portfolio/',
    },
  ]);

  protected readonly flippedStates = signal<boolean[]>(this.projects().map(() => false));
  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly selectedProject = computed<Project | null>(() => {
    const index = this.selectedIndex();
    return index === null ? null : this.projects()[index];
  });

  protected toggleCard(index: number): void {
    this.flippedStates.update((states) => states.map((state, i) => (i === index ? !state : false)));
  }

  protected openDialog(index: number): void {
    this.selectedIndex.set(index);
  }

  protected closeDialog(): void {
    this.selectedIndex.set(null);
  }

  protected nextProject(): void {
    this.selectedIndex.update((index) => (index === null ? null : (index + 1) % this.projects().length));
  }
}
