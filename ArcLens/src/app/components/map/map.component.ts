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
import Search from '@arcgis/core/widgets/Search';

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
    },
    findBestSequence: true,
  });

  private stopSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol({
    style: "circle",
    size: 7,
    color: "red",
    outline: {
      color: "white",
      width: 1
    }
  });

  private routeSymbol: SimpleLineSymbol = new SimpleLineSymbol({
    color: [0, 0, 255, 0.5],
    style: "dash",
    width: 2
  });

  ngOnInit(): void {
    const heatmapWebMap = new WebMap({
      portalItem: {
        id: "c7f0408b3f14470b9a695a03cd39928b" // Replace with your heatmap WebMap ID
      }
    });

    const pointWebMap = new WebMap({
      portalItem: {
        id: "858a68ae306b4b94a7180c5e20e925e6" // Replace with your point map WebMap ID
      }
    });

    const mapView = new MapView({
      container: "viewDiv",
      map: heatmapWebMap,
      zoom: 12,
      center: [2.3522, 48.8566]
    });

    // Add the search widget to the map view
    const searchWidget = new Search({
      view: mapView
    });
    mapView.ui.add(searchWidget, {
      position: "top-right"
    });

    mapView.on("click", (event) => this.addStop(event));
    mapView.watch("zoom", (newValue) => this.handleZoomChange(newValue, mapView, heatmapWebMap, pointWebMap));
  }

  private handleZoomChange(zoom: number, mapView: MapView, heatmapWebMap: WebMap, pointWebMap: WebMap): void {
    if (zoom > 12) {
      if (mapView.map !== pointWebMap) {
        mapView.map = pointWebMap;
        mapView.map.add(this.routeLayer);
      }
    } else {
      if (mapView.map !== heatmapWebMap) {
        mapView.map = heatmapWebMap;
        mapView.map.add(this.routeLayer);
      }
    }
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
