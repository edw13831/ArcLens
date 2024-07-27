import { Component, OnInit } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import WebScene from '@arcgis/core/WebScene';
import SceneView from '@arcgis/core/views/SceneView';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
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
        id: "a2ded8d0bf4245e4923b898af67b8291"
      }
    });

    const scene = new WebScene({
      portalItem: {
        id: "c8cf26d7acab4e45afcd5e20080983c1"
      }
    });

    // Create 2D view and set as active
    const mapViewParams = { ...initialViewParams, map: webmap };
    appConfig.mapView = this.createView(mapViewParams, MapView);
    appConfig.activeView = appConfig.mapView;

    // Create 3D view, won't initialize until container is set
    const sceneViewParams = { ...initialViewParams, container: null, map: scene };
    appConfig.sceneView = this.createView(sceneViewParams, SceneView);

    // Switch the view between 2D and 3D each time the button is clicked
    switchButton.addEventListener("click", () => {
      this.switchView(appConfig, switchButton);
    });
  }

  // Switches the view from 2D to 3D and vice versa
  switchView(appConfig: { mapView: any; sceneView: any; activeView: any; container: any; }, switchButton: HTMLButtonElement): void {
    const is3D = appConfig.activeView.type === "3d";
    const activeViewpoint = appConfig.activeView.viewpoint.clone();

    // Remove the reference to the container for the previous view
    appConfig.activeView.container = null;

    if (is3D) {
      // If the input view is a SceneView, set the viewpoint on the MapView instance.
      // Set the container on the MapView and flag it as the active view.
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

  // Convenience function for creating either a 2D or 3D view depending on the type parameter
  createView(params: any, ViewClass: any): any {
    return new ViewClass(params);
  }
}
