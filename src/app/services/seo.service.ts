import { Injectable, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

export interface PageSeo {
  titleKey: string;
  descriptionKey: string;
  path: string;
  noindex?: boolean;
}

const SITE_ORIGIN = 'https://jensbaumann.com';
const OG_LOCALES: Record<string, string> = { de: 'de_DE', en: 'en_US' };

@Injectable({ providedIn: 'root' })
export class SeoService implements OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private subscription?: Subscription;

  apply(page: PageSeo): void {
    this.subscription?.unsubscribe();
    this.subscription = this.translate
      .stream([page.titleKey, page.descriptionKey])
      .subscribe((values: Record<string, string>) => {
        this.render(page, values[page.titleKey], values[page.descriptionKey]);
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private render(page: PageSeo, title: string, description: string): void {
    const url = `${SITE_ORIGIN}${page.path}`;
    const lang = this.translate.currentLang() ?? 'de';

    this.title.setTitle(title);
    this.meta.updateTag({
      name: 'robots',
      content: page.noindex ? 'noindex, nofollow' : 'index, follow',
    });
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALES[lang] ?? OG_LOCALES['de'] });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }

    link.href = url;
  }
}
