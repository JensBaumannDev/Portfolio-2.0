import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Location } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-legal-notice',
  imports: [TranslatePipe],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNotice {
  private readonly location = inject(Location);
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.apply({
      titleKey: 'seo.legal_title',
      descriptionKey: 'seo.legal_desc',
      path: '/legal-notice',
    });
  }

  goBack(): void {
    this.location.back();
  }
}
