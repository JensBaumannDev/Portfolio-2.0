import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';

export interface GitHubStats {
  commits: number;
  pullRequests: number;
  projects: number;
  primaryLang: string;
}

interface GitHubRepo {
  language: string | null;
  fork: boolean;
}

interface SearchResult {
  total_count: number;
}

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private readonly http = inject(HttpClient);
  private readonly username = 'JensBaumannDev';
  private readonly base = 'https://api.github.com';

  getStats(): Observable<GitHubStats> {
    const headers = new HttpHeaders({
      Accept: 'application/vnd.github.cloak-preview+json',
    });

    const commits$ = this.http.get<SearchResult>(
      `${this.base}/search/commits?q=author:${this.username}+author-date:2026-01-01..2026-12-31&per_page=1`,
      { headers }
    );

    const prs$ = this.http.get<SearchResult>(
      `${this.base}/search/issues?q=author:${this.username}+type:pr+created:2026-01-01..2026-12-31&per_page=1`,
      { headers }
    );

    const repos$ = this.http.get<GitHubRepo[]>(
      `${this.base}/users/${this.username}/repos?per_page=100`
    );

    return forkJoin([commits$, prs$, repos$]).pipe(
      map(([commitSearch, prSearch, repos]) => {
        const ownRepos = repos.filter(r => !r.fork);

        const langCount: Record<string, number> = {};
        ownRepos.forEach(r => {
          if (r.language) {
            langCount[r.language] = (langCount[r.language] ?? 0) + 1;
          }
        });
        const sorted = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
        const tsIndex = sorted.findIndex(([l]) => l === 'TypeScript');
        const jsIndex = sorted.findIndex(([l]) => l === 'JavaScript');
        if (tsIndex > 0 && jsIndex === 0) {
          sorted[0] = sorted.splice(tsIndex, 1, sorted[0])[0];
        }
        const primaryLang = sorted[0]?.[0] ?? '—';

        return {
          commits: commitSearch.total_count,
          pullRequests: prSearch.total_count,
          projects: ownRepos.length,
          primaryLang,
        };
      }),
      catchError(() => of({ commits: 968, pullRequests: 208, projects: 18, primaryLang: 'TypeScript' }))
    );
  }
}
