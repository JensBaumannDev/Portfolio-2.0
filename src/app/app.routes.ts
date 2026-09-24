import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landingpage/landingpage.component').then((m) => m.Landingpage) },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./components/project-detail/project-detail.component').then((m) => m.ProjectDetail),
  },
  {
    path: 'legal-notice',
    loadComponent: () => import('./pages/legal-notice/legal-notice.component').then((m) => m.LegalNotice),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then((m) => m.PrivacyPolicy),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFound),
  },
];
