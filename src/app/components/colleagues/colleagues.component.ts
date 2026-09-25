import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faBrandLinkedinIn } from '@ng-icons/font-awesome/brands';
import { TranslatePipe } from '@ngx-translate/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-colleagues',
  imports: [NgIcon, TranslatePipe, RevealDirective],
  providers: [provideIcons({ faBrandLinkedinIn })],
  templateUrl: './colleagues.component.html',
  styleUrl: './colleagues.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Colleagues {
  protected readonly testimonials = [
    {
      name: 'Julia Keller',
      quoteKey: 'colleagues.testimonial1',
      url: 'https://www.linkedin.com/in/julia-keller-970409389/',
      icon: 'linkedin',
      linkKey: 'colleagues.profile',
    },
    {
      name: 'Calvin Kamp',
      quoteKey: 'colleagues.testimonial2',
      url: 'https://calvin-kamp.de/',
      icon: 'website',
      linkKey: 'colleagues.website',
    },
    {
      name: 'André Funk',
      quoteKey: 'colleagues.testimonial3',
      url: 'https://www.linkedin.com/in/andr%C3%A9-funk-665698401/',
      icon: 'linkedin',
      linkKey: 'colleagues.profile',
    },
  ] as const;
}
