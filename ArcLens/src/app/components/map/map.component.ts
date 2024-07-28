import { Component, OnInit } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import WebScene from '@arcgis/core/WebScene';
import SceneView from '@arcgis/core/views/SceneView';
// import Daylight from 'esri/widgets/Daylight';
import Daylight from '@arcgis/core/widgets/Daylight';
import Expand from '@arcgis/core/widgets/Expand';

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
      zoom: 5,
      center: [2.3522, 48.8566],
      container: appConfig.container
    };
 
    const webmap = new WebMap({
      portalItem: {
        id: "ce04efd930424dc38b5eff6db0f260d9"
      }
    });
 
    const scene = new WebScene({
      portalItem: {
        id: "828ad330a1424e95b2ac35a5a5491bb0"
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

    const daylight = new Daylight({
      view: appConfig.sceneView,
      // plays the animation twice as fast than the default one
      playSpeedMultiplier: 2,
      // disable the timezone selection button
      visibleElements: {
        timezone: false
      }
    });
 
    // Add widget inside an Expand widget to be able to hide it on devices with small screens
    appConfig.sceneView.ui.add(new Expand({ content: daylight, view: appConfig.sceneView, expanded: true }), "top-right");

    // Add widget inside an Expand widget to be able to hide it on devices with small screens
    appConfig.sceneView.ui.add(new Expand({ content: daylight, view: appConfig.sceneView, expanded: true }), "top-right");
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
 
 