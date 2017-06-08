
import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {StoryService} from '../../services/story.service';
import {Story} from '../../models/story';
import {isUndefined} from 'util';
import {loggerFactory} from '../../config/ConfigLog4j';
import {GoogleApiService} from '../../services/google-api.service';
//import Marker = google.maps.Marker;


declare const google: any;

@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.css']
})
export class InteractiveMapComponent implements OnInit {
  @Input() editedStory: Story;
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
  private log = loggerFactory.getLogger('component.InteractiveMap');


  constructor(private googleApi: GoogleApiService, private ngZone: NgZone, private _storyService: StoryService) {}

  initialise() {
    this.latlng = new google.maps.LatLng(this.editedStory.loc.coordinates[1], this.editedStory.loc.coordinates[0]);

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
    // set up marker with info from story
    //this.recOrTreeMarker = new google.maps.Marker();
    let content = '';
    // console.log('in GM retrieve: story= ', story);
    if (!isUndefined(this.editedStory.photoLinks)) {
      for (const uri of this.editedStory.photoLinks)
      {
        content = content + '<img src=\"' + uri + '\" ' + 'alt=\"tree image\"'
          + ' style=\"width:50px;height:50px;margin:5px\">';
        this.log.debug('uri of story.photolinks:' + content);
      }
    }
    content = content + ('<p>' + this.editedStory.content + '</p>');
    this.log.debug('final content: ' + content);

    if (this.editedStory.shapeType != null){
      if (this.editedStory.shapeType === 'rectangle') {
        //SW then NE
        const SW = new google.maps.LatLng(this.editedStory.SWCoords.coordinates[0], this.editedStory.SWCoords.coordinates[1]);
        const NE = new google.maps.LatLng(this.editedStory.NECoords.coordinates[0], this.editedStory.NECoords.coordinates[1]);
        const myBounds = new google.maps.LatLngBounds(SW, NE);
        this.recOrTreeMarker = new google.maps.Rectangle();
        this.recOrTreeMarker.setBounds(myBounds);
        this.recOrTreeMarker.setMap(this.map);
        this.recOrTreeMarker.setOptions({editable: true, draggable: false, strokeColor: '#FF0000', fillColor: '#ffbf2a', fillOpacity: 0.5});
       // this.recOrTreeMarker.addListener('bounds_changed', this.onRectPositionChanged.emit(this.recOrTreeMarker.getBounds()));
        // TODO set other options

        // strokeColor: '#FF0000',
        //   strokeOpacity: 0.8,
        //   strokeWeight: 2,
        //   fillColor: '#fff764',
        //   fillOpacity: 0.5,
        //   map: this.map,
        //   bounds: {
        //
        // }
      }// draw it on
      else
      {
        this.recOrTreeMarker = new google.maps.Marker();
        this.recOrTreeMarker.setPosition(this.latlng);
        this.recOrTreeMarker.setTitle(this.editedStory.title);
        this.recOrTreeMarker.setMap(this.map);
        this.recOrTreeMarker.setIcon('../assets/treeMarker.png');
        this.recOrTreeMarker.draggable = false;
      }
      // zoom map to here
      this.map.panTo(this.latlng );
      this.map.setZoom(18);

    }

  }
  deleteMarker() {
    this.log.debug('deleteMarkers');
    if (this.recOrTreeMarker)   {
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
        this.deleteMarker();
        this.recOrTreeMarker = e.overlay;

        if (e.type === 'rectangle') {
          const bounds = e.overlay.getBounds();
          console.log('drawing man. bounds=' + bounds);
          this.onRectPositionChanged.emit(bounds);

        } else if (e.type === 'marker') {
          const pos = e.overlay.getPosition();
          console.log('drawing man. REc pos=' + pos);
          this.onPositionChanged.emit(pos);
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
        //this.onPositionChanged.emit(e.latLng.toString());
      });



    }); // end initMap

  } // end ngoninit

}
