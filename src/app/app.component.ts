import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Navigation } from './components/navigation/navigation.component';
import { Footer } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';
import { NAVBAR_HEIGHT } from './constants/layout.constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, Footer, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly viewportScroller = inject(ViewportScroller);
  protected readonly themeService = inject(ThemeService);
  protected readonly languageService = inject(LanguageService);

  protected readonly title = signal('Portfolio');

  constructor() {
    this.viewportScroller.setOffset([0, NAVBAR_HEIGHT]);
  }
}
