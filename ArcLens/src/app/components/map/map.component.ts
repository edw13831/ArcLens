import { Component, OnInit } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import Graphic from '@arcgis/core/Graphic';
import * as route from "@arcgis/core/rest/route.js";
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
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

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  filterOptions = [
    { label: 'Castle', checked: false },
    { label: 'Notable...', checked: false },
    { label: 'Less than 1K', checked: false },
    { label: '10K - 50K', checked: false },
    { label: '50K', checked: false },
    { label: '100K', checked: false }
  ];

  private routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
  private routeLayer: GraphicsLayer = new GraphicsLayer();

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
        id: "cbad2d8efb4348cfb14b8dc2e3da30c3" // Replace with your WebMap ID
      },
      layers: [this.routeLayer] // Add the routeLayer to the map
    });

    const mapView = new MapView({
      container: "viewDiv",
      map: webmap,
      zoom: 12,
      center: [2.3522, 48.8566]
    });

    mapView.on("click", (event) => this.addStop(event));
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
  }

  private showRoute(data: any): void {
    console.log(data);
    const routeResult = data.routeResults[0].route;
    routeResult.symbol = this.routeSymbol;
    this.routeLayer.add(routeResult);
  }

  showMore(): void {
    console.log('Show more filters...');
    // Implement functionality to show more filters if needed
  }

  doSomething($event:any){
    $event.stopPropagation();
    //Another instructions
}
}
