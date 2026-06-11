import { Routes } from '@angular/router';
import { Landingpage } from './pages/landingpage/landingpage.component';
import { LegalNotice } from './pages/legal-notice/legal-notice.component';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: Landingpage },
  { path: 'legal-notice', component: LegalNotice },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: '**', redirectTo: '' }
];

