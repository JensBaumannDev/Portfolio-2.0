import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { RevealDirective } from '../../directives/reveal.directive';
import {
  SHOWCASE_PROJECTS,
  ShowcaseProjectCategory,
} from '../../constants/showcase-projects.constants';
type ProjectFilter = 'all' | ShowcaseProjectCategory;
@Component({
  selector: 'app-projects',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, RevealDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  readonly spotlight = input(false);
  protected readonly filters: readonly ProjectFilter[] = ['all', 'frontend', 'backend'];
  protected readonly activeFilter = signal<ProjectFilter>('all');
  protected readonly filteredProjects = computed(() =>
    this.spotlight()
      ? SHOWCASE_PROJECTS.filter(
          (project) => project.slug === 'coderr' || project.slug === 'dabubble',
        ).sort((a, b) => a.category.localeCompare(b.category) * -1)
      : SHOWCASE_PROJECTS.filter(
          (project) => this.activeFilter() === 'all' || project.category === this.activeFilter(),
        ),
  );
}
