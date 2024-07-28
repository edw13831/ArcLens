import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from "./components/map/map.component";
import { SearchComponent } from "./components/search/search.component";
import { CommonModule } from '@angular/common';
import { routeProviders } from './app.routes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponent, SearchComponent, CommonModule,MatIconModule],
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
