import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideExternalLink, lucidePlus, lucideArrowRight } from '@ng-icons/lucide';
import { ProjectDialog } from './project-dialog/project-dialog.component';
import { Reveal } from '../../directives/reveal.directive';
import { RevealStagger } from '../../directives/reveal-stagger.directive';
import { PROJECTS, Project, ProjectCategory } from '../../constants/projects.constants';

type ProjectFilter = 'all' | ProjectCategory;

@Component({
  selector: 'app-projects',
  imports: [NgOptimizedImage, TranslatePipe, NgIcon, ProjectDialog, Reveal, RevealStagger],
  providers: [
    provideIcons({
      lucideGithub,
      lucideExternalLink,
      lucidePlus,
      lucideArrowRight,
    })
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  protected readonly filters: readonly ProjectFilter[] = ['all', 'frontend', 'backend'];
  protected readonly activeFilter = signal<ProjectFilter>('all');
  protected readonly projects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all' ? PROJECTS : PROJECTS.filter((project) => project.category === filter);
  });

  private readonly openKey = signal<string | null>('coderr');

  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly selectedProject = computed<Project | null>(() => {
    const index = this.selectedIndex();
    return index === null ? null : this.projects()[index];
  });

  protected isOpen(key: string): boolean {
    return this.openKey() === key;
  }

  protected selectFilter(value: string): void {
    const filter = this.filters.find((filter) => filter === value);
    if (filter) this.setFilter(filter);
  }

  protected setFilter(filter: ProjectFilter): void {
    if (filter === this.activeFilter()) return;

    this.closeDialog();
    this.activeFilter.set(filter);
    this.openKey.set(this.projects()[0]?.key ?? null);
  }

  protected toggle(key: string): void {
    this.openKey.update((current) => (current === key ? null : key));
  }

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
