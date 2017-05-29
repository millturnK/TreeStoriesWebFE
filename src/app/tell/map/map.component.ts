import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {StoryService} from '../../services/story.service';
import {Story} from '../../models/story';
import {isUndefined} from 'util';
import {loggerFactory} from '../../config/ConfigLog4j';
import {GoogleApiService} from '../../services/google-api.service';


declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Output() onPositionChanged = new EventEmitter<string>();
  @Output() onRectPositionChanged = new EventEmitter<string>();
  myLatLng = {lat: -25.363, lng: 131.044};
  map: any;
  recOrTreeMarker: any = null;
   input: any;
  searchBox: any;
  // this saves the last drawing
  lastOverlay: any;
  latlng;
  drawingManager;

  errorMsg= '';
  private log = loggerFactory.getLogger('component.GoogleMaps');


  constructor(private googleApi: GoogleApiService, private ngZone: NgZone, private _storyService: StoryService) {}

  initialise() {
    this.latlng = new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng);

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.latlng,
      zoom: 4
    });
    // if (this.useTreePosMarker) {
    //   this.treeMarker = new google.maps.Marker({
    //     position: this.latlng,
    //     map: this.map,
    //     draggable: true,
    //     title: 'Tree position'
    //   });
    // }
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        drawingModes: ['marker', 'rectangle']
      },
      markerOptions: {icon: '../assets/treeMarker.png', editable: true, draggable: true},
      rectangleOptions: {editable: true, draggable: true}
    });

    this.drawingManager.setMap(this.map);


  }
  deleteMarker() {
    this.log.debug('deleteMarkers');
    if(this.recOrTreeMarker)   {
      this.recOrTreeMarker.setMap(null);
    }
  }

  ngOnInit() {
    this.googleApi.initMap().then(() => {

      this.initialise();


      /// Create the search box and link it to the UI element.
      this.input = document.getElementById('pac-input');
      this.searchBox = new google.maps.places.SearchBox(this.input);
      const defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631));
      this.searchBox.setBounds(defaultBounds);

      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input);
      // Bias the SearchBox results towards current map's viewport.

      this.map.addListener('bounds_changed', e => {

        if (this.map.getBounds() !== undefined) {
          this.searchBox.setBounds(this.map.getBounds());
        } else {
          console.log('getBounds is undefined');
        }


      });
      
      google.maps.event.addListener(this.drawingManager, 'overlaycomplete',  e =>  {
        // this.lastOverlay = null; // delete previous shape
        // this.lastOverlay = e.overlay; //replace with new shape
        this.deleteMarker();
        this.recOrTreeMarker = e.overlay;

        if (e.type === 'rectangle') {
          const bounds = e.overlay.getBounds();
          console.log('drawing man. bounds=' + bounds);
          this.onRectPositionChanged.emit(bounds);
          // none of this works...
         // this.drawingManager.setDrawingMode(null); // Return to 'hand' mode
         //  this.drawingManager.setOptions({
         //    drawingControl: false
         //  });
          // TODO emit pos changed for rectangle and switch between area or points, setting drawing manager accordingly

        } else if (e.type === 'marker') {
          const pos = e.overlay.getPosition();
          console.log('drawing man. REc pos=' + pos);
          this.onPositionChanged.emit(pos);
          // this.drawingManager.setOptions({
          //   drawingControl: false
          // });
         // this.drawingManager.setDrawingMode(null); // Return to 'hand' mode


        }

      });
      // let markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      this.searchBox.addListener('places_changed', e => {

        this.ngZone.run(() => {

          const places = this.searchBox.getPlaces();
          let lat = 0;
          let lng = 0;

          console.log('in searchBox. places=', places);


          // For each place, get the icon, name and location.
          const bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log('Returned place contains no geometry');
              return;
            }
            const latlng = place.geometry.location;
            lat = latlng.lat().toFixed(6);
            lng = latlng.lng().toFixed(6);
            console.log('in search box places. lat=', lat, 'lng', lng);
            console.log('place.geometry.location=', latlng);

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });

          this.map.fitBounds(bounds);
          const posString = lat + ',' + lng;
          this.log.debug('in search box listener. posString=' + posString);
          // pan to new position
          this.map.panTo(lat, lng);
        });



      }); // end places changed


      // this.map.addListener('click', function(e) {
      this.map.addListener('click', e => {
        this.map.panTo(e.latLng);
        this.onPositionChanged.emit(e.latLng.toString());
      });



    }); // end initMap

  } // end ngoninit

}
