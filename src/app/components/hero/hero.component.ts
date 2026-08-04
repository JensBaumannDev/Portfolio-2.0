import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faBrandGithub, faBrandLinkedinIn, faBrandYoutube } from '@ng-icons/font-awesome/brands';
import { lucideDownload } from '@ng-icons/lucide';

@Component({
  selector: 'app-hero',
  imports: [TranslatePipe, NgOptimizedImage, NgIcon],
  providers: [provideIcons({ faBrandGithub, faBrandLinkedinIn, faBrandYoutube, lucideDownload })],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
