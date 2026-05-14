import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'assets',
    loadComponent: () => import('./features/assets/assets').then((m) => m.Assets),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
