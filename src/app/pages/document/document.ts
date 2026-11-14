import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PdfPreview } from '../../components/pdf-preview/pdf-preview';
import { PageHero } from '../../components/page-hero/page-hero';
import { DocumentsService } from '../../services/documents.service';
import { SeoService } from '../../services/seo.service';

type DocumentKind = 'cv' | 'certificates';

@Component({
  selector: 'app-document-page',
  imports: [PageHero, PdfPreview, RouterLink, TranslatePipe],
  templateUrl: './document.html',
  styleUrl: './document.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPage {
  private readonly documents = inject(DocumentsService);
  private readonly seo = inject(SeoService);

  readonly kind = input.required<DocumentKind>();
  protected readonly fileUrl = computed(() =>
    this.kind() === 'certificates' ? this.documents.certificatesUrl : this.documents.cvUrl(),
  );
  protected readonly fileName = computed(() => this.fileUrl().split('/').at(-1) ?? '');

  constructor() {
    effect(() => {
      const kind = this.kind();
      this.seo.apply({
        titleKey: `documents.${kind}.seo_title`,
        descriptionKey: `documents.${kind}.sub`,
        path: `/documents/${kind}`,
      });
    });
  }
}
