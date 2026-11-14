import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail').then((m) => m.ProjectDetail),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'documents/cv',
    data: { kind: 'cv' },
    loadComponent: () => import('./pages/document/document').then((m) => m.DocumentPage),
  },
  {
    path: 'documents/certificates',
    data: { kind: 'certificates' },
    loadComponent: () => import('./pages/document/document').then((m) => m.DocumentPage),
  },
  {
    path: 'legal-notice',
    loadComponent: () => import('./pages/legal-notice/legal-notice').then((m) => m.LegalNotice),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
