import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { TECHNOLOGY_ICONS } from '../../constants/technologies.constants';

@Component({
  selector: 'app-skills',
  imports: [NgOptimizedImage, TranslatePipe],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  protected readonly icons = TECHNOLOGY_ICONS;
  protected readonly groups = [
    {
      key: 'frontend',
      tools: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Supabase'],
    },
    {
      key: 'backend',
      tools: ['Python', 'Django', 'PostgreSQL', 'SQLite', 'Redis', 'Docker'],
    },
    {
      key: 'tools',
      tools: ['Git', 'VS Code', 'Vite', 'Figma', 'Linux', 'Nginx'],
    },
  ] as const;
}
