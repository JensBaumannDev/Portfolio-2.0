import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectDialog } from './project-dialog/project-dialog.component';
import { Reveal } from '../../directives/reveal.directive';
import { RevealStagger } from '../../directives/reveal-stagger.directive';

export interface Project {
  key: string;
  number: string;
  featured: boolean;
  statValues: string[];
  tags: string[];
  image: string;
  imageAlt: string;
  github: string;
  live: string;
}

@Component({
  selector: 'app-projects',
  imports: [NgOptimizedImage, TranslatePipe, ProjectDialog, Reveal, RevealStagger],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  protected readonly projects = signal<Project[]>([
    {
      key: 'dabubble',
      number: '01',
      featured: true,
      statValues: ['RT', 'Auth', 'DM'],
      tags: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
      image: './img/projects/webp/dabubble_project.webp',
      imageAlt: 'DABubble Project',
      github: 'https://github.com/JensBaumannDev/DABubble',
      live: 'https://jensbaumann.com/projects/dabubble',
    },
    {
      key: 'join',
      number: '02',
      featured: true,
      statValues: ['D&D', 'CRUD', 'Team'],
      tags: ['Angular', 'TypeScript', 'SCSS', 'Supabase'],
      image: './img/projects/webp/join_project.webp',
      imageAlt: 'Join Project',
      github: 'https://github.com/JensBaumannDev/Join',
      live: 'https://jensbaumann.com/projects/join/',
    },
    {
      key: 'el_pollo_loco',
      number: '03',
      featured: true,
      statValues: ['OOP', 'Loop', 'SFX'],
      tags: ['HTML', 'CSS', 'JavaScript'],
      image: './img/projects/webp/el_pollo_loco_project.webp',
      imageAlt: 'El Pollo Loco Game',
      github: 'https://github.com/JensBaumannDev/El-Pollo-Loco',
      live: 'https://jensbaumann.com/projects/el_pollo_loco/',
    },
    {
      key: 'pokedex',
      number: '04',
      featured: false,
      statValues: [],
      tags: ['HTML', 'CSS', 'JavaScript', 'API'],
      image: './img/projects/webp/pokedex_project.webp',
      imageAlt: 'Pokedex Project',
      github: 'https://github.com/JensBaumannDev/Pokedex',
      live: 'https://jensbaumann.com/projects/pokedex/',
    },
    {
      key: 'portfolio',
      number: '05',
      featured: false,
      statValues: [],
      tags: ['Angular', 'TypeScript', 'SCSS'],
      image: './img/projects/webp/portfolio_project.webp',
      imageAlt: 'Portfolio Website',
      github: 'https://github.com/JensBaumannDev/Portfolio',
      live: 'https://jensbaumann.com/projects/portfolio/',
    },
  ]);

  protected readonly featuredProjects = computed(() => this.projects().filter((project) => project.featured));
  protected readonly moreProjects = computed(() => this.projects().filter((project) => !project.featured));

  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly selectedProject = computed<Project | null>(() => {
    const index = this.selectedIndex();
    return index === null ? null : this.projects()[index];
  });

  protected openDialog(key: string): void {
    const index = this.projects().findIndex((project) => project.key === key);
    if (index !== -1) {
      this.selectedIndex.set(index);
    }
  }

  protected closeDialog(): void {
    this.selectedIndex.set(null);
  }

  protected nextProject(): void {
    this.selectedIndex.update((index) => (index === null ? null : (index + 1) % this.projects().length));
  }
}
