import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHero } from '../../components/page-hero/page-hero';
import { ContactCta } from '../../components/contact-cta/contact-cta';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about-page',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, PageHero, ContactCta],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly facts = ['location', 'available', 'languages'] as const;
  protected readonly career = ['sales', 'leadership', 'support', 'training'] as const;
  protected readonly workSteps = ['value', 'design', 'tech', 'rules'] as const;
  protected readonly interests = ['musician', 'gamer', 'family', 'dog'] as const;

  constructor() {
    inject(SeoService).apply({
      titleKey: 'seo.about_title',
      descriptionKey: 'seo.about_desc',
      path: '/about',
    });
  }
}
