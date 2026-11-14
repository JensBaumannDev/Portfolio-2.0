import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHero } from '../../components/page-hero/page-hero';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [PageHero, RouterLink, TranslatePipe],
  template: `
    <app-page-hero
      [label]="'notfound.code' | translate"
      [title]="'notfound.title' | translate"
      [sub]="'notfound.text' | translate"
    >
      <div heroActions class="btns actions">
        <a routerLink="/" class="b b-blue">{{ 'notfound.back' | translate }}</a>
      </div>
    </app-page-hero>
  `,
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  constructor() {
    inject(SeoService).apply({
      titleKey: 'seo.notfound_title',
      descriptionKey: 'seo.notfound_desc',
      path: '/404',
      noindex: true,
    });
  }
}
