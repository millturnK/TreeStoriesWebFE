import { Component, OnInit, Input, EventEmitter, Output  } from '@angular/core';
import {GoogleApiService} from './services/google-api.service';
import {loggerFactory} from '../config/ConfigLog4j';
//import {Story} from './models/story';
import {isUndefined} from 'util';
import {StoryService} from './services/story.service';
import {Story} from '../models/story';
declare const google: any;
//import Marker = google.maps.Marker;



@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
// TODO detect click and drag on marker to new position
export class GoogleMapsComponent implements OnInit {
  @Output() onPositionChanged = new EventEmitter<string>();
  myLatLng = {lat: -25.363, lng: 131.044};
  map: any;
  treeMarker: any;
  input: any;
  searchBox: any;
  latlng;
  @Input() displayAllStories = false;
  errorMsg= '';
  private log = loggerFactory.getLogger('component.GoogleMaps');
  markers= [];

  constructor(private googleApi: GoogleApiService, private _storyService: StoryService) {}

  initialise()
  {
    this.latlng = new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng);
    this.log.debug('init: displayAllStories=' + this.displayAllStories);

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
    // if displayAllStories = true get all stories from DB
    if (this.displayAllStories)
    {
      this._storyService.getStories().subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
    }


  }
  // parse them and add them to map
  successfulRetrieve(stories: Story[]){

    //let tempMarkers: google.maps.Marker[] = [];

    for (const story of stories) {
      const position = new google.maps.LatLng(story.latitude, story.longitude);
      const marker = new google.maps.Marker();
      marker.setPosition(position);
      marker.setTitle(story.title);
      marker.setMap(this.map);
      marker.addListener('click', event => {
        this.log.debug('Click called. Marker title=' + marker.getTitle());
        this.log.debug('Click called. content=' + story.content);
        const infowindow = new google.maps.InfoWindow({
          content: story.content,
          position: marker.getPosition(),
          maxWidth: 100,
          });
         infowindow.open(this.map);
      });
      this.markers.push(marker);

    }




  }
  failedRetrieve(error: any) {
    this.log.error('failed retrieve: ' + error);
    this.errorMsg = error;

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


     // this.map.addListener('click', function(e) {
        this.map.addListener('click', e => {
        //placeMarkerAndPanTo(e.latLng, this.map);
        console.log('map click detected at lat', e.latLng.lat().valueOf());
        //this.story.locationLat = e.latLng.lat();
        //this.testfunconclass(e.latLng.lat());
          this.map.panTo(e.latLng);
          this.treeMarker.setPosition(e.latLng);
          //this.story.locationLat = e.latLng.latitude;
          //this.story.locationLong = e.latLng.longitude;
          this.onPositionChanged.emit(e.latLng.toString());
      });



    }); //end initMap

   }//end ngoninit

  displayAllStoriesOnMap()
  {

  }



}
