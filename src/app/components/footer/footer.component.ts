import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopyright } from '@ng-icons/lucide';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, NgIcon],
  providers: [provideIcons({ lucideCopyright })],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {}
