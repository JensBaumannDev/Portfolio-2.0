import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHero } from '../../components/page-hero/page-hero';
import { CONTACT_EMAIL } from '../../constants/site.constants';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-legal-notice',
  imports: [PageHero, RouterLink, TranslatePipe],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNotice {
  protected readonly email = CONTACT_EMAIL;

  constructor() {
    inject(SeoService).apply({
      titleKey: 'seo.legal_title',
      descriptionKey: 'seo.legal_desc',
      path: '/legal-notice',
    });
  }
}
