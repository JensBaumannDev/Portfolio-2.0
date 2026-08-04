import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideExternalLink, lucidePlus, lucideArrowRight } from '@ng-icons/lucide';
import { ProjectDialog } from './project-dialog/project-dialog.component';
import { Reveal } from '../../directives/reveal.directive';
import { RevealStagger } from '../../directives/reveal-stagger.directive';
import { PROJECTS, Project } from '../../constants/projects.constants';

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
  protected readonly projects = signal<readonly Project[]>(PROJECTS);

  private readonly openKey = signal<string | null>('dabubble');

  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly selectedProject = computed<Project | null>(() => {
    const index = this.selectedIndex();
    return index === null ? null : this.projects()[index];
  });

  protected isOpen(key: string): boolean {
    return this.openKey() === key;
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
