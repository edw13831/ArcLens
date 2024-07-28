import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();

  onSearch(event: any) {
    this.search.emit(event.target.value);
  }

  onSearchClick() {
    const inputElement = document.querySelector('.search-input') as HTMLInputElement;
    this.search.emit(inputElement.value);
  }
}
