import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { malt } from '../../icons/malt';
import { faBrandGithub, faBrandLinkedinIn } from '@ng-icons/font-awesome/brands';

@Component({
  selector: 'app-footer',
  imports: [NgIcon, RouterLink, TranslatePipe],
  providers: [provideIcons({ faBrandGithub, faBrandLinkedinIn, malt })],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer { }
