import { Injectable, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'de' | 'en';

const STORAGE_KEY = 'lang';
const SUPPORTED: readonly AppLanguage[] = ['de', 'en'];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly current = this.translate.currentLang;

  constructor() {
    this.translate.use(readStoredLanguage());

    effect(() => {
      const lang = this.current();
      if (lang) {
        this.document.documentElement.lang = lang;
      }
    });
  }

  use(lang: AppLanguage): void {
    this.translate.use(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }
}

function readStoredLanguage(): AppLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  return SUPPORTED.includes(stored as AppLanguage) ? (stored as AppLanguage) : 'de';
}
