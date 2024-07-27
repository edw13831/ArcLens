import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from "./components/map/map.component";
import { SearchComponent } from "./components/search/search.component";
import { CommonModule } from '@angular/common';
import { routeProviders } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponent, SearchComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ArcLens';
  showMap = false;
  searchQuery = '';

  constructor(private cdr: ChangeDetectorRef) {}


  handleSearch(query: string) {
    this.searchQuery = query;
    this.showMap = true;
    this.cdr.detectChanges(); // Trigger change detection

  }
}
