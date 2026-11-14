import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CONTACT_EMAIL } from '../../constants/site.constants';

@Component({
  selector: 'app-contact-cta',
  imports: [RouterLink, TranslatePipe],
  template: `
    <section class="contact" [attr.aria-label]="'home.contact.label' | translate">
      <h2>{{ 'home.contact.title' | translate }}</h2>
      <p>{{ 'home.contact.text' | translate }}</p>
      <div class="btns">
        <a class="b b-blue" [href]="'mailto:' + email">{{ 'home.contact.mail' | translate }}</a>
        <a class="b b-dark" routerLink="/contact">{{ 'home.contact.form' | translate }}</a>
      </div>
    </section>
  `,
  styleUrl: './contact-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCta {
  protected readonly email = CONTACT_EMAIL;
}
