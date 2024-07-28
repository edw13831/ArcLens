import { Component, OnInit } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import Graphic from '@arcgis/core/Graphic';
import * as route from "@arcgis/core/rest/route.js"
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

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
}
