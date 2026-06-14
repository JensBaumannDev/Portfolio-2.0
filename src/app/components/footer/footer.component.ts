import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly flippedTiles = signal<Record<string, boolean>>({});

  protected toggleFlip(tileId: string): void {
    this.flippedTiles.update((state) => ({
      ...state,
      [tileId]: !state[tileId],
    }));
  }
}
