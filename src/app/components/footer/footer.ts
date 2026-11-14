import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SOCIAL_LINKS } from '../../constants/site.constants';
import { MotionService } from '../../services/motion.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly motion = inject(MotionService);
  protected readonly socials = SOCIAL_LINKS;
  protected readonly year = new Date().getFullYear();

  protected toTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: this.motion.scrollBehavior() });
  }
}
