import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideLinkedin, lucideYoutube } from '@ng-icons/lucide';

@Component({
  selector: 'app-hero',
  imports: [TranslatePipe, NgOptimizedImage, NgIconComponent, RouterLink],
  providers: [provideIcons({ lucideGithub, lucideLinkedin, lucideYoutube })],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
