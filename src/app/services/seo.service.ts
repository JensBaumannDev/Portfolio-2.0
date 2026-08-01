import { Injectable, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

export interface PageSeo {
  titleKey: string;
  descriptionKey: string;
  path: string;
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
        this.render(values[page.titleKey], values[page.descriptionKey], page.path);
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private render(title: string, description: string, path: string): void {
    const url = `${SITE_ORIGIN}${path}`;
    const lang = this.translate.currentLang() ?? 'de';

    this.title.setTitle(title);
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
