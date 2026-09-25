import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideGamepad2, lucideHeart, lucideMusic2, lucidePawPrint } from '@ng-icons/lucide';
import { faBrandYoutube } from '@ng-icons/font-awesome/brands';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [NgIcon, NgOptimizedImage, TranslatePipe, RevealDirective],
  providers: [provideIcons({ lucideDownload, lucideGamepad2, lucideHeart, lucideMusic2, lucidePawPrint, faBrandYoutube })],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  private readonly translate = inject(TranslateService);

  get cvUrl(): string {
    return this.translate.currentLang() === 'en'
      ? '/cv/CV-Jens-Baumann.pdf'
      : '/cv/Lebenslauf-Jens-Baumann.pdf';
  }
}
