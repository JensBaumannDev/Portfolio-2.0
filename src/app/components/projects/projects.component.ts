import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SHOWCASE_PROJECTS, TECHNOLOGY_ICONS, ShowcaseProject, ShowcaseProjectCategory } from '../../constants/showcase-projects.constants';
import { RevealDirective } from '../../directives/reveal.directive';

type ProjectFilter = 'all' | ShowcaseProjectCategory;

@Component({
  selector: 'app-projects',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, RevealDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  protected readonly projects = SHOWCASE_PROJECTS;
  protected readonly technologyIcons = TECHNOLOGY_ICONS;
  protected readonly selectedProject = signal<ShowcaseProject>(SHOWCASE_PROJECTS[0]);
  protected readonly activeFilter = signal<ProjectFilter>('all');
  protected readonly filteredProjects = computed(() => this.activeFilter() === 'all' ? this.projects : this.projects.filter((project) => project.category === this.activeFilter()));
  protected readonly selectedProjectIndex = computed(() => String(this.filteredProjects().findIndex((project) => project.slug === this.selectedProject().slug) + 1).padStart(2, '0'));

  protected selectProject(project: ShowcaseProject): void {
    this.selectedProject.set(project);
  }

  protected selectProjectBySlug(slug: string): void {
    const project = this.filteredProjects().find((item) => item.slug === slug);
    if (project) this.selectProject(project);
  }

  protected selectFilter(filter: ProjectFilter): void {
    this.activeFilter.set(filter);
    const [firstProject] = filter === 'all' ? this.projects : this.projects.filter((project) => project.category === filter);
    if (firstProject) this.selectedProject.set(firstProject);
  }
}
