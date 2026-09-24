import { Injectable, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'de' | 'en';


@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly current = this.translate.currentLang;

  constructor() {
    effect(() => {
      const lang = this.current();
      if (lang) {
        this.document.documentElement.lang = lang;
      }
    });
  }

  initialize() {
    return this.translate.use(detectLanguage(this.document));
  }

  use(lang: AppLanguage): void {
    this.translate.use(lang);
  }
}

function detectLanguage(document: Document): AppLanguage {
  const languages = document.defaultView?.navigator.languages ?? [document.defaultView?.navigator.language ?? 'en'];
  return languages[0]?.toLowerCase().startsWith('de') ? 'de' : 'en';
}
