import { Injectable, computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private readonly translate = inject(TranslateService);

  readonly cvUrl = computed(() =>
    this.translate.currentLang() === 'en'
      ? '/cv/CV-Jens-Baumann.pdf'
      : '/cv/Lebenslauf-Jens-Baumann.pdf',
  );

  readonly certificatesUrl = '/certificates/Zertifikate-Jens-Baumann.pdf';
}
