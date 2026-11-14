import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHero } from '../../components/page-hero/page-hero';
import { CONTACT_EMAIL } from '../../constants/site.constants';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [PageHero, TranslatePipe],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicy {
  protected readonly email = CONTACT_EMAIL;

  constructor() {
    inject(SeoService).apply({
      titleKey: 'seo.privacy_title',
      descriptionKey: 'seo.privacy_desc',
      path: '/privacy-policy',
    });
  }
}
