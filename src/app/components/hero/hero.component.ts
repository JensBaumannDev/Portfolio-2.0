import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faBrandGithub, faBrandLinkedinIn, faBrandYoutube } from '@ng-icons/font-awesome/brands';

@Component({
  selector: 'app-hero',
  imports: [TranslatePipe, NgOptimizedImage, NgIcon, RouterLink],
  providers: [provideIcons({ faBrandGithub, faBrandLinkedinIn, faBrandYoutube })],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
