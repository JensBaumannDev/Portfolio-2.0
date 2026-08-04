import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Navigation } from './components/navigation/navigation.component';
import { Footer } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, Footer, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly document = inject(DOCUMENT);
  protected readonly themeService = inject(ThemeService);
  protected readonly languageService = inject(LanguageService);

  protected readonly title = signal('Portfolio');

  constructor() {
    this.viewportScroller.setOffset(() => [0, this.anchorOffset()]);
  }

  private anchorOffset(): number {
    const root = this.document.documentElement;
    const scrollPadding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const targetId = this.document.location.hash.slice(1);
    const target = targetId ? this.document.getElementById(targetId) : null;
    const scrollMargin = target ? parseFloat(getComputedStyle(target).scrollMarginTop) || 0 : 0;

    return scrollPadding + scrollMargin;
  }
}
