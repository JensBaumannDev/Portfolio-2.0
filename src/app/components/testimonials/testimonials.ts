import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-testimonials',
  imports: [TranslatePipe],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Testimonials {
  protected readonly testimonials = [
    {
      name: 'Julia Keller',
      quoteKey: 'home.testimonials.quote_1',
      url: 'https://www.linkedin.com/in/julia-keller-970409389/',
      linkKey: 'home.testimonials.profile',
    },
    {
      name: 'Calvin Kamp',
      quoteKey: 'home.testimonials.quote_2',
      url: 'https://calvin-kamp.de/',
      linkKey: 'home.testimonials.website',
    },
    {
      name: 'André Funk',
      quoteKey: 'home.testimonials.quote_3',
      url: 'https://www.linkedin.com/in/andr%C3%A9-funk-665698401/',
      linkKey: 'home.testimonials.profile',
    },
  ] as const;
}
