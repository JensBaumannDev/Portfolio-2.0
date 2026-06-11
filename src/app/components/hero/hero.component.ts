import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GitHubService, GitHubStats } from '../../services/github.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements OnInit {
  private readonly github = inject(GitHubService);

  protected readonly name = signal('Jens Baumann');
  protected readonly stats = signal<GitHubStats | null>(null);
  protected readonly loading = signal(true);
  protected readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.github.getStats().subscribe(data => {
      this.stats.set(data);
      this.loading.set(false);
    });
  }
}
