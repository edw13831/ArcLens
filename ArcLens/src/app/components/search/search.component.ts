import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();

  constructor(private router: Router) {}


  onSearch(event: any) {
    const query = event.target.value;
    this.search.emit(query);
    this.router.navigate(['/map'], { queryParams: { query } });
  }
}
