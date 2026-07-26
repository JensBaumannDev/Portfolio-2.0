import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Navigation } from './components/navigation/navigation.component';
import { Footer } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, Footer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly translate = inject(TranslateService);
  private readonly viewportScroller = inject(ViewportScroller);
  protected readonly themeService = inject(ThemeService);

  protected readonly title = signal('Portfolio');

  constructor() {
    this.viewportScroller.setOffset([0, 72]);

    const stored = localStorage.getItem('lang');
    this.translate.use(stored === 'en' ? 'en' : 'de');
  }
}
