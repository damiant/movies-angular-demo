import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'movies',
    loadComponent: () => import('./movies/movies.page').then((m) => m.MoviesPage),
  },
  {
    path: 'actor/:id',
    loadComponent: () => import('./actor-movies/actor-movies.page').then((m) => m.ActorMoviesPage),
  },
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
];
