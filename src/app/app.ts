import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Navigation } from './components/navigation/navigation';
import { Footer } from './components/footer/footer';
import { ReloadScrollService } from './services/reload-scroll.service';
import { NavigationScrollService } from './services/navigation-scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, Footer, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:pagehide)': 'reloadScroll.savePosition()',
    '(window:beforeunload)': 'reloadScroll.savePosition()',
  },
})
export class App {
  protected readonly reloadScroll = inject(ReloadScrollService);

  constructor() {
    inject(NavigationScrollService);
  }
}
