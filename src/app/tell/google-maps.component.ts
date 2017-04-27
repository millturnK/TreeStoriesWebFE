import { Component, OnInit, Input, EventEmitter, Output  } from '@angular/core';
import {GoogleApiService} from './services/google-api.service';
import {Story} from './models/story';
import {isUndefined} from 'util';
declare const google: any;
//import LatLng = google.maps.LatLng;
//import LatLng = google.maps.LatLng;



@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
// TODO detect click and drag on marker to new position
export class GoogleMapsComponent implements OnInit {
  @Input() story: Story;
  @Output() onPositionChanged = new EventEmitter<string>();
  myLatLng = {lat: -25.363, lng: 131.044};
  map: any;
  treeMarker: any;
  input: any;
  searchBox: any;
  latlng;

  constructor(private googleApi: GoogleApiService) {}

  initialise()
  {
    this.latlng = new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng);

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.latlng,
      zoom: 4
    });
    this.treeMarker = new google.maps.Marker({
      position: this.latlng,
      map: this.map,
      draggable: true,
      title: 'Tree position'
    });
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

        /*let ok = true;
        if (this.map === undefined)
        {
          console.log('map is undefined');
        }

        if (e.getBounds() === undefined){
          console.log('getBounds is undefined');
          ok = false;
        }
        if (ok) {
          console.log('bounds changed: bounds=', this.map.getBounds());
          searchBox.setBounds(this.map.getBounds());
        } else {
          setTimeout(this.map.getBounds(), 500);
        }*/
        if (this.map.getBounds() !== undefined) {
          this.searchBox.setBounds(this.map.getBounds());
        } else {
          console.log('getBounds is undefined');
        }


      });
      //let markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      this.searchBox.addListener('places_changed', e => {
        const places = this.searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        /*// Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];*/

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log('Returned place contains no geometry');
            return;
          }
          /*const icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };*/

          /*// Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: this.map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));*/

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });

        console.log('bounds=', bounds);
        this.map.fitBounds(bounds);
      }); //end places changed






      this.treeMarker.addListener('dragend', e => {
        console.log('marker dragged to', e.latLng.lat());
        this.onPositionChanged.emit(e.latLng);
        //this.onPositionChanged.emit(e.latLng.toString());
      });

      /*function placeMarkerAndPanTo(latLng, map) {
        console.log('map=', map);
        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
          draggable:true
        });
        map.panTo(latLng);
        //this.story.locationLat = latLng.lat;
        //this.story.locationLong = latLng.longitude;
      }*/

     // this.map.addListener('click', function(e) {
        this.map.addListener('click', e => {
        //placeMarkerAndPanTo(e.latLng, this.map);
        console.log('map click detected at lat', e.latLng.lat().valueOf());
        //this.story.locationLat = e.latLng.lat();
        //this.testfunconclass(e.latLng.lat());
          this.map.panTo(e.latLng);
          this.treeMarker.setPosition(e.latLng);
          this.story.locationLat = e.latLng.latitude;
          this.story.locationLong = e.latLng.longitude;
          this.onPositionChanged.emit(e.latLng.toString());
      });



    }); //end initMap

   }//end ngoninit

   testfunconclass(lat: number) {
    console.log('yeah we got it: ', lat);
    this.story.locationLat = lat;
     console.log('set story to: ', this.story);
   }


}
