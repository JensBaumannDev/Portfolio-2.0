import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-hero',
  imports: [TranslatePipe],
  template: `
    <header class="page-hero">
      <div class="top">
        <a class="back" [href]="backUrl()" (click)="back($event)"
          ><span aria-hidden="true">‹ </span>{{ 'page.back' | translate }}</a
        >
      </div>
      <p class="label">{{ label() }}</p>
      <h1>{{ title() }}</h1>
      <p class="sub" [class.separated]="separatedSub()">{{ sub() }}</p>
      <ng-content select="[heroActions]" />
      <ng-content select="[heroMedia]" />
    </header>
  `,
  styleUrl: './page-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHero {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly sub = input.required<string>();
  readonly separatedSub = input(false);
  readonly backFragment = input<string>();
  readonly historyBack = input(false);
  protected readonly backUrl = computed(() =>
    this.router.serializeUrl(this.router.createUrlTree(['/'], { fragment: this.backFragment() })),
  );

  protected back(event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    if (this.historyBack() && this.router.lastSuccessfulNavigation()?.previousNavigation) {
      this.location.back();
      return;
    }
    void this.router.navigateByUrl(this.backUrl());
  }
}
