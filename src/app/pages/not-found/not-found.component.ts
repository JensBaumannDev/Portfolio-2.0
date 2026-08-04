import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="not-found">
      <p class="not-found-code" aria-hidden="true">{{ 'notfound.code' | translate }}</p>
      <h1 class="not-found-title">{{ 'notfound.title' | translate }}</h1>
      <p class="not-found-text">{{ 'notfound.text' | translate }}</p>
      <a routerLink="/" class="button not-found-link">{{ 'notfound.back' | translate }}</a>
    </div>
  `,
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.apply({
      titleKey: 'seo.notfound_title',
      descriptionKey: 'seo.notfound_desc',
      path: '/404',
      noindex: true,
    });
  }
}
