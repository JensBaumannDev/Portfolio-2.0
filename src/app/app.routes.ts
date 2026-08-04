import { Routes } from '@angular/router';
import { Landingpage } from './pages/landingpage/landingpage.component';

export const routes: Routes = [
  { path: '', component: Landingpage },
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
