import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideMail,
  lucideFileText,
  lucideRocket,
  lucideCode2,
  lucideUsers,
  lucideServer,
  lucideMapPin,
} from '@ng-icons/lucide';

interface HeroTile {
  delay: number;
}

const HERO_COLS = 8;
const HERO_ROWS = 5;

@Component({
  selector: 'app-hero',
  imports: [RouterLink, TranslatePipe, NgIconComponent],
  providers: [
    provideIcons({
      lucideMail,
      lucideFileText,
      lucideRocket,
      lucideCode2,
      lucideUsers,
      lucideServer,
      lucideMapPin,
    }),
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements OnInit {
  protected readonly animate = signal(true);
  protected readonly tiles = this.buildTiles();
  protected readonly flipped = signal<string | null>(null);

  protected toggleFlip(key: string, event?: Event): void {
    event?.preventDefault();
    this.flipped.update((current) => (current === key ? null : key));
  }

  ngOnInit(): void {
    // Reveal soll bei jedem Reload (F5) laufen – nur bei reduced-motion aus.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      this.animate.set(false);
    }
  }

  private buildTiles(): HeroTile[] {
    const tiles: HeroTile[] = [];

    for (let row = 0; row < HERO_ROWS; row++) {
      for (let col = 0; col < HERO_COLS; col++) {
        const delay = col * 110 + Math.random() * 60;
        tiles.push({ delay });
      }
    }

    return tiles;
  }
}
