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
  private readonly cacheKey = 'github_stats';
  private readonly cacheTimeKey = 'github_stats_timestamp';
  private readonly oneDayMs = 86400000;
  private readonly retryDelayMs = 1800000;

  getStats(): Observable<GitHubStats> {
    let cachedStats: GitHubStats | null = null;
    let parsedTime = 0;

    const cachedData = localStorage.getItem(this.cacheKey);
    const cachedTime = localStorage.getItem(this.cacheTimeKey);
    if (cachedData && cachedTime) {
      parsedTime = parseInt(cachedTime, 10);
      try {
        cachedStats = JSON.parse(cachedData) as GitHubStats;
      } catch {}
    }

    if (cachedStats && !isNaN(parsedTime) && Date.now() - parsedTime < this.oneDayMs) {
      return of(cachedStats);
    }

    const headers = new HttpHeaders({
      Accept: 'application/vnd.github.cloak-preview+json',
    });

    const year = new Date().getFullYear();
    const dateRange = `${year}-01-01..${year}-12-31`;

    const commits$ = this.http.get<SearchResult>(
      `${this.base}/search/commits?q=author:${this.username}+author-date:${dateRange}&per_page=1`,
      { headers }
    );

    const prs$ = this.http.get<SearchResult>(
      `${this.base}/search/issues?q=author:${this.username}+type:pr+created:${dateRange}&per_page=1`,
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
        let primaryLang = sorted[0]?.[0] ?? '—';
        if (primaryLang === 'JavaScript' && langCount['TypeScript']) {
          primaryLang = 'TypeScript';
        }

        const stats: GitHubStats = {
          commits: commitSearch.total_count,
          pullRequests: prSearch.total_count,
          projects: ownRepos.length,
          primaryLang,
        };

        try {
          localStorage.setItem(this.cacheKey, JSON.stringify(stats));
          localStorage.setItem(this.cacheTimeKey, Date.now().toString());
        } catch {}

        return stats;
      }),
      catchError(() => {
        if (cachedStats) {
          const retryAt = Date.now() - this.oneDayMs + this.retryDelayMs;
          try {
            localStorage.setItem(this.cacheTimeKey, retryAt.toString());
          } catch {}
          return of(cachedStats);
        }
        return of({ commits: 968, pullRequests: 208, projects: 18, primaryLang: 'TypeScript' });
      })
    );
  }
}
