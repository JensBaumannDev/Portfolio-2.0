import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideDownload } from '@ng-icons/lucide';
import { GitHubService, GitHubStats } from '../../services/github.service';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, TranslatePipe, NgIconComponent],
  providers: [provideIcons({ lucideMail, lucideDownload })],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements OnInit {
  private readonly github = inject(GitHubService);
  protected readonly stats = signal<GitHubStats | null>(null);

  ngOnInit(): void {
    this.github.getStats().subscribe((data) => {
      this.stats.set(data);
    });
  }
}
