import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Navigation } from './components/navigation/navigation.component';
import { Footer } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, Footer, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
