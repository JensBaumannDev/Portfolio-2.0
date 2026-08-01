import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Location } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [TranslatePipe],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicy {
  private readonly location = inject(Location);
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.apply({
      titleKey: 'seo.privacy_title',
      descriptionKey: 'seo.privacy_desc',
      path: '/privacy-policy',
    });
  }

  goBack(): void {
    this.location.back();
  }
}
