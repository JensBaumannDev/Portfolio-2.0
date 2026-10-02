import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Projects } from '../projects/projects.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, TranslatePipe, Projects],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly translate = inject(TranslateService);
  protected readonly cvUrl = computed(() =>
    this.translate.currentLang() === 'en'
      ? '/cv/CV-Jens-Baumann.pdf'
      : '/cv/Lebenslauf-Jens-Baumann.pdf',
  );
  protected readonly activeSide = signal<'frontend' | 'backend' | null>(null);
  protected readonly frontendOpen = signal(false);
  protected readonly backendOpen = signal(false);

  protected onHeroPointerMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || !(event.currentTarget instanceof HTMLElement)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    this.activeSide.set(event.clientX < bounds.left + bounds.width / 2 ? 'frontend' : 'backend');
  }
}
