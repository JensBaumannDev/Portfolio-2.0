import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Reveal } from '../../directives/reveal.directive';
import { RevealStagger } from '../../directives/reveal-stagger.directive';

@Component({
  selector: 'app-about',
  imports: [TranslatePipe, RouterLink, Reveal, RevealStagger],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}
