import { provideRouter, RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { MapComponent } from './components/map/map.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'map', component: MapComponent }
];

export const appRoutes = RouterModule.forRoot(routes);
export const routeProviders = provideRouter(routes);
