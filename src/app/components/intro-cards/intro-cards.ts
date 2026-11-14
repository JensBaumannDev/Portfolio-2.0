import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-intro-cards',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe],
  templateUrl: './intro-cards.html',
  styleUrl: './intro-cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroCards {}
