import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import WebScene from '@arcgis/core/WebScene';
import SceneView from '@arcgis/core/views/SceneView';
import Daylight from '@arcgis/core/widgets/Daylight';
import Expand from '@arcgis/core/widgets/Expand';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import Graphic from '@arcgis/core/Graphic';
import * as route from "@arcgis/core/rest/route.js";
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
    const switchButton = document.getElementById('switch-btn') as HTMLButtonElement;

    const appConfig = {
      mapView: null as unknown as MapView,
      sceneView: null as unknown as SceneView,
      activeView: null as unknown as MapView | SceneView,
      container: "viewDiv"
    };

    const initialViewParams = {
      zoom: 12,
      center: [-122.43759993450347, 37.772798684981126],
      container: appConfig.container
    };

    const webmap = new WebMap({
      portalItem: {
        id: "cbad2d8efb4348cfb14b8dc2e3da30c3"
      }
    });

    const scene = new WebScene({
      portalItem: {
        id: "828ad330a1424e95b2ac35a5a5491bb0"
      }
    });

    const mapViewParams = { ...initialViewParams, map: webmap };
    appConfig.mapView = this.createView(mapViewParams, MapView);
    appConfig.activeView = appConfig.mapView;

    const sceneViewParams = { ...initialViewParams, container: null, map: scene };
    appConfig.sceneView = this.createView(sceneViewParams, SceneView);

    appConfig.mapView.on("click", (event) => this.addStop(event));
    appConfig.sceneView.on("click", (event) => this.addStop(event));

    switchButton.addEventListener("click", () => {
      this.switchView(appConfig, switchButton);
    });

    const daylight = new Daylight({
      view: appConfig.sceneView,
      playSpeedMultiplier: 2,
      visibleElements: {
        timezone: false
      }
    });

    appConfig.sceneView.ui.add(new Expand({ content: daylight, view: appConfig.sceneView, expanded: true }), "top-right");
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

  switchView(appConfig: { mapView: any; sceneView: any; activeView: any; container: any; }, switchButton: HTMLButtonElement): void {
    const is3D = appConfig.activeView.type === "3d";
    const activeViewpoint = appConfig.activeView.viewpoint.clone();

    appConfig.activeView.container = null;

    if (is3D) {
      appConfig.mapView.viewpoint = activeViewpoint;
      appConfig.mapView.container = appConfig.container;
      appConfig.activeView = appConfig.mapView;
      switchButton.innerText = "3D";
    } else {
      appConfig.sceneView.viewpoint = activeViewpoint;
      appConfig.sceneView.container = appConfig.container;
      appConfig.activeView = appConfig.sceneView;
      switchButton.innerText = "2D";
    }
  }

  createView(params: any, ViewClass: any): any {
    return new ViewClass(params);
  }
}
