import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-story',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './story.html',
  styleUrl: './story.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Story {
  protected readonly rows: readonly { key: string; project?: string }[] = [
    { key: 'structure', project: 'join' },
    { key: 'debugging', project: 'videoflix' },
    { key: 'customers' },
  ];
}
