import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'portfolio',
    title: 'Portfólio leteckých projektov',
    loadComponent: () => import('./pages/portfolio/portfolio.page').then((m) => m.PortfolioPage),
  },
  {
    path: 'portfolio/:slug',
    title: 'Detail projektu',
    loadComponent: () => import('./pages/project-detail/project-detail.page').then((m) => m.ProjectDetailPage),
  },
  {
    path: 'sluzby-a-flotila',
    title: 'Služby & Flotila dronov',
    loadComponent: () => import('./pages/services-fleet/services-fleet.page').then((m) => m.ServicesFleetPage),
  },
  {
    path: 'legislativa-a-tim',
    title: 'Bezpečnosť, legislatíva & Tím',
    loadComponent: () => import('./pages/compliance-team/compliance-team.page').then((m) => m.ComplianceTeamPage),
  },
  {
    path: 'dopyt',
    title: 'Nezáväzná ponuka & Overenie lokácie',
    loadComponent: () => import('./pages/quote/quote.page').then((m) => m.QuotePage),
  },
  {
    path: '**',
    title: 'Stránka nenájdená',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
