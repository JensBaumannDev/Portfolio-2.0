import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { RevealDirective } from '../../directives/reveal.directive';
import {
  SHOWCASE_PROJECTS,
  ShowcaseProject,
  ShowcaseProjectCategory,
} from '../../constants/showcase-projects.constants';
type ProjectFilter = 'all' | ShowcaseProjectCategory;
const SPOTLIGHT_SLUGS: readonly string[] = ['videoflix', 'coderr'];
const SPOTLIGHT_TECHNOLOGY_LIMIT = 4;
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
      ? SHOWCASE_PROJECTS.filter((project) => SPOTLIGHT_SLUGS.includes(project.slug))
      : SHOWCASE_PROJECTS.filter(
          (project) => this.activeFilter() === 'all' || project.category === this.activeFilter(),
        ),
  );
  protected visibleTechnologies(project: ShowcaseProject): readonly string[] {
    return this.spotlight()
      ? project.technologies.slice(0, SPOTLIGHT_TECHNOLOGY_LIMIT)
      : project.technologies;
  }
}
