import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
interface LocationSuggestions {
  text: string;
}

interface AutoSuggestions {
  suggestions: LocationSuggestions[];
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterModule, 
    ReactiveFormsModule, 
    MatAutocompleteModule, 
    MatInputModule, 
    HttpClientModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  locationControl = new FormControl();
  filteredOptions: Observable<LocationSuggestions[]> = new Observable<LocationSuggestions[]>();  // Initialize with empty observable

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.filteredOptions = this.locationControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => this.getSuggestions(value))
    );
  }

  getSuggestions(inputedLoc: string): Observable<LocationSuggestions[]> {
    const apiToken = "AAPK5c928794591042709bc8fbfe5277f506L61TaOqI9tSpQ14zCyIoUivahGVw1OMcUR_gRPn38GmmQjsm8FqS9y0ak5mmdNjh";
    const EsriUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${inputedLoc}&category=Populated%20Place&f=json&token=${apiToken}`;

    return this.http.get<AutoSuggestions>(EsriUrl).pipe(
      map((response: AutoSuggestions) => response.suggestions || [])
    );
  }

  displayFn(location: LocationSuggestions): string {
    return location && location.text ? location.text : '';
  }

  onOptionSelected(event: any) {
    const selectedLocation: LocationSuggestions = event.option.value;
    this.locationControl.setValue(selectedLocation.text);
    // Handle the selected option here
    
    console.log(this.locationControl);
    this.onSearch()
  }

  onSearch() {
    const query = this.locationControl.value;
    this.search.emit(query);
    this.router.navigate(['/map'], { queryParams: { query } });
  }
}
