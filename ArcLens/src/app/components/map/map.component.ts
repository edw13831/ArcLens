import { Component, OnInit, ViewChild } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import Graphic from '@arcgis/core/Graphic';
import * as route from "@arcgis/core/rest/route.js";
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import Point from '@arcgis/core/geometry/Point';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
    SignupComponent
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild(SignupComponent) signupModal!: SignupComponent;

  filterOptions = [
    { label: 'Castle', checked: false },
    { label: 'Notable...', checked: false },
    { label: 'Less than 1K', checked: false },
    { label: '10K - 50K', checked: false },
    { label: '50K', checked: false },
    { label: '100K', checked: false }
  ];

  results = [
    { icon: 'A', name: 'rue cremieux', distance: '1.2km / 17 minutes', isFavorite: false, visible: false },
    { icon: 'B', name: 'Château de Versailles', distance: '1.1km / 16 minutes', isFavorite: false, visible: false },
    { icon: 'C', name: 'Bucherer Clock Shop', distance: '2.6km / 35 minutes', isFavorite: false, visible: false },
    { icon: 'D', name: 'Louvre Pyramid', distance: '4.2km / 55 minutes', isFavorite: false, visible: false }
  ];

  private routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
  private routeLayer: GraphicsLayer = new GraphicsLayer();
  private mapView!: MapView;
  private showOnlyFavorites: boolean = false;
  showSignup: boolean = false;

  private routeParams: RouteParameters = new RouteParameters({
    apiKey: "AAPK5c928794591042709bc8fbfe5277f506L61TaOqI9tSpQ14zCyIoUivahGVw1OMcUR_gRPn38GmmQjsm8FqS9y0ak5mmdNjh",
    stops: new FeatureSet(),
    outSpatialReference: {
      wkid: 3857
    }
  });

  private stopSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol({
    style: "circle",
    size: 7,
  });

  private routeSymbol: SimpleLineSymbol = new SimpleLineSymbol({
    color: [0, 0, 255, 0.5],
    style: "dash",
    width: 2
  });

  ngOnInit(): void {
    const webmap = new WebMap({
      portalItem: {
        id: "27cbea083f2f4a82b12e07407924c0ec" // Replace with your WebMap ID
      },
      layers: [this.routeLayer] // Add the routeLayer to the map
    });

    this.mapView = new MapView({
      container: "viewDiv",
      map: webmap,
      zoom: 12,
      center: [2.3522, 48.8566]
    });

    this.mapView.on("click", (event) => this.addStop(event));
  }

  private addStop(event: any): void {
    const stop = new Graphic({
      geometry: event.mapPoint,
      symbol: this.stopSymbol
    });
    this.routeLayer.add(stop);

    (this.routeParams.stops as FeatureSet).features.push(stop);
    if ((this.routeParams.stops as FeatureSet).features.length >= 2) {
      route.solve(this.routeUrl, this.routeParams).then((data) => this.showRoute(data));
    }

    // Show the next result in the array
    if (!this.showOnlyFavorites) {
      const nextResult = this.results.find(result => !result.visible);
      if (nextResult) {
        nextResult.visible = true;
      }
    }
  }

  private showRoute(data: any): void {
    console.log(data);
    const routeResult = data.routeResults[0].route;
    routeResult.symbol = this.routeSymbol;
    this.routeLayer.add(routeResult);

    // Calculate the midpoint of the route
    const midpoint = routeResult.geometry.extent.center;

    // Calculate the distance of the route
    const distance = 11.25;
  }

  toggleFavorite(index: number): void {
    this.results[index].isFavorite = !this.results[index].isFavorite;

    if (index === 2 && this.results[index].isFavorite) {
      this.signupModal.show();
    }
  }

  toggleFavoritesFilter(): void {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    this.results.forEach(result => {
      result.visible = this.showOnlyFavorites ? result.isFavorite : false;
    });

    if (!this.showOnlyFavorites) {
      const nextResult = this.results.find(result => !result.visible);
      if (nextResult) {
        nextResult.visible = true;
      }
    }
  }

  showMore(): void {
    console.log('Show more filters...');
    // Implement functionality to show more filters if needed
  }

  doSomething($event: any) {
    $event.stopPropagation();
    // Additional instructions
  }
}
