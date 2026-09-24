import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { SHOWCASE_PROJECTS, TECHNOLOGY_ICONS } from '../../constants/showcase-projects.constants';

@Component({
  selector: 'app-project-detail',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), { initialValue: 'join' });
  protected readonly project = computed(() => SHOWCASE_PROJECTS.find((project) => project.slug === this.slug()) ?? SHOWCASE_PROJECTS[0]);
  protected readonly projectCopyKey = computed(() => this.project().slug.replaceAll('-', '_'));
  protected readonly technologyIcons = TECHNOLOGY_ICONS;
}
