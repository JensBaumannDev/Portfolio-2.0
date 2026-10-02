import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Navigation } from './components/navigation/navigation.component';
import { Footer } from './components/footer/footer.component';
import { ReloadScrollService } from './services/reload-scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, Footer, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:pagehide)': 'reloadScroll.savePosition()',
    '(window:beforeunload)': 'reloadScroll.savePosition()',
  },
})
export class App {
  protected readonly reloadScroll = inject(ReloadScrollService);
}
