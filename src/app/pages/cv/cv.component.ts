import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

interface TimelineEntry {
  rangeKey: string;
  titleKey: string;
  placeKey: string;
  textKey: string;
}

@Component({
  selector: 'app-cv',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cv {
  protected readonly experience = signal<TimelineEntry[]>([
    {
      rangeKey: 'cv.exp_agency_range',
      titleKey: 'cv.exp_agency_title',
      placeKey: 'cv.exp_agency_place',
      textKey: 'cv.exp_agency_text',
    },
    {
      rangeKey: 'cv.exp_lead_range',
      titleKey: 'cv.exp_lead_title',
      placeKey: 'cv.exp_lead_place',
      textKey: 'cv.exp_lead_text',
    },
  ]);

  protected readonly education = signal<TimelineEntry[]>([
    {
      rangeKey: 'cv.edu_da_range',
      titleKey: 'cv.edu_da_title',
      placeKey: 'cv.edu_da_place',
      textKey: 'cv.edu_da_text',
    },
    {
      rangeKey: 'cv.edu_telekom_range',
      titleKey: 'cv.edu_telekom_title',
      placeKey: 'cv.edu_telekom_place',
      textKey: 'cv.edu_telekom_text',
    },
  ]);

  protected readonly skills = signal<string[]>([
    'Angular',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'HTML',
    'SCSS / Sass',
    'REST-APIs',
    'Git',
    'Supabase',
  ]);
}
