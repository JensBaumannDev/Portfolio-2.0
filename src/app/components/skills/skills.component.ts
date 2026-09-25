import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faBrandGithub } from '@ng-icons/font-awesome/brands';
import { TranslatePipe } from '@ngx-translate/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-skills',
  imports: [NgIcon, NgOptimizedImage, TranslatePipe, RevealDirective],
  providers: [provideIcons({ faBrandGithub })],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills { }
