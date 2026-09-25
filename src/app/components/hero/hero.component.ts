import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faBrandGithub, faBrandLinkedinIn } from '@ng-icons/font-awesome/brands';
import { lucideDownload } from '@ng-icons/lucide';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  imports: [NgIcon, NgOptimizedImage, TranslatePipe],
  providers: [provideIcons({ faBrandGithub, faBrandLinkedinIn, lucideDownload })],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly translate = inject(TranslateService);

  get cvUrl(): string {
    return this.translate.currentLang() === 'en'
      ? '/cv/CV-Jens-Baumann.pdf'
      : '/cv/Lebenslauf-Jens-Baumann.pdf';
  }
}
