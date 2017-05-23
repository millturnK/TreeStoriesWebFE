import { Component, OnInit, Input, EventEmitter, Output  } from '@angular/core';
import {GoogleApiService} from './services/google-api.service';
import {loggerFactory} from '../config/ConfigLog4j';
//import {Story} from './models/story';
import {isUndefined} from 'util';
import {StoryService} from '../services/story.service';
import {Story} from '../models/story';
//import OverlayCompleteEvent = google.maps.drawing.OverlayCompleteEvent;
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
  @Input() displayAllStories = false;
  @Input() useTreePosMarker = false;
  @Input() useDrawingManager = false;
  myLatLng = {lat: -25.363, lng: 131.044};
  map: any;
  treeMarker: any;
  input: any;
  searchBox: any;
  latlng;
  drawingManager;

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
    if (this.useTreePosMarker) {
      this.treeMarker = new google.maps.Marker({
        position: this.latlng,
        map: this.map,
        draggable: true,
        title: 'Tree position'
      });
    }
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: this.useDrawingManager,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        drawingModes: ['marker', 'rectangle']
      },
      markerOptions: {icon: '../assets/treeMarker.png', editable: true, draggable: true},
      polygonOptions: {editable: true, draggable: true},
      rectangleOptions: {editable: true, draggable: true}
      // circleOptions: {
      //   fillColor: '#ffff00',
      //   fillOpacity: 1,
      //   strokeWeight: 5,
      //   clickable: false,
      //   editable: true,
      //   zIndex: 1
      // }
    });

    this.drawingManager.setMap(this.map);

    // if displayAllStories = true get all stories from DB
    if (this.displayAllStories){
      this._storyService.getStories().subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
    }


  }
  // parse them and add them to map
  successfulRetrieve(stories: Story[]){
    // TODO remove this when migrating environments - find a way to get this from env var

    const baseServerUrl = 'http://localhost:3000';

    for (const story of stories) {
      const position = new google.maps.LatLng(story.latitude, story.longitude);
      const marker = new google.maps.Marker();
      // this should be formatted in HTML tags - put in for loop
      let content = '';
      // console.log('in GM retrieve: story= ', story);
      if (!isUndefined(story.photoLinks)) {
        for (const uri of story.photoLinks)
        {
          content = content + '<img src=\"' + uri + '\" ' + 'alt=\"tree image\"'
            + ' style=\"width:50px;height:50px;margin:5px\">';
          this.log.debug('uri of story.photolinks:' + content);
        }
      }
      content = content + ('<p>' + story.content + '</p>');
      this.log.debug('final content: ' + content);
      marker.setPosition(position);
      marker.setTitle(story.title);
      marker.setMap(this.map);
      marker.addListener('click', event => {
        this.log.debug('Click called. Marker title=' + marker.getTitle());
        this.log.debug('Click called. content=' + story.content);
        const infowindow = new google.maps.InfoWindow({
          content: content,
          position: marker.getPosition(),
          maxWidth: 200,
          maxHeight: 200
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

        if (this.map.getBounds() !== undefined) {
          this.searchBox.setBounds(this.map.getBounds());
        } else {
          console.log('getBounds is undefined');
        }


      });

      google.maps.event.addListener(this.drawingManager, 'overlaycomplete',  e =>  {
        if (e.type === 'circle') {
          const radius = e.overlay.getRadius();
          this.log.debug('drawing man. Radius=' + radius);
        }
        else if (e.type === 'polygon'){
          const paths = e.overlay.getPaths();
          this.log.debug('drawing man. paths=' + paths);
        }
        else if (e.type === 'rectangle'){
          const bounds = e.overlay.getBounds();
          this.log.debug('drawing man. bounds=' + bounds);
        }
        else if (e.type === 'marker'){

          const pos = e.overlay.getPosition();
          this.log.debug('drawing man. pos=' + pos);
          this.onPositionChanged.emit(e.overlay.getPosition());

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


      if (this.useTreePosMarker) {
        this.treeMarker.addListener('dragend', e => {
          // console.log('marker dragged to', e.latLng.lat());
          this.onPositionChanged.emit(e.latLng);
          //this.onPositionChanged.emit(e.latLng.toString());
        });
      }

     // this.map.addListener('click', function(e) {
        this.map.addListener('click', e => {
        //placeMarkerAndPanTo(e.latLng, this.map);
        //console.log('map click detected at lat', e.latLng.lat().valueOf());
        //this.story.locationLat = e.latLng.lat();
        //this.testfunconclass(e.latLng.lat());
          this.map.panTo(e.latLng);
          if (this.useTreePosMarker) {
            this.treeMarker.setPosition(e.latLng);
          }

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
