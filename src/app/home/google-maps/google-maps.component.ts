import {Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, NgZone} from '@angular/core';
import {GoogleApiService} from '../../services/google-api.service';
import {loggerFactory} from '../../config/ConfigLog4j';
import {isUndefined} from 'util';
import {StoryService} from '../../services/story.service';
import {Story} from '../../models/story';

// declare const google: any;  // no longer required, types being picked up by @types



@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
// TODO detect click and drag on marker to new position
export class GoogleMapsComponent implements OnInit {

  @Output() onPlaceChanged = new EventEmitter<string>();

  @ViewChild('search')
  public searchElementRef: ElementRef;



  myLatLng = {lat: -25.363, lng: 131.044};
  map: any;
  // treeMarker: any;
  input: any;
  searchBox: any;
  latlng;
  // zoom level for map
  zoom = 4;

  errorMsg= '';
  private log = loggerFactory.getLogger('component.GoogleMaps');
  markers= [];

  constructor(private googleApi: GoogleApiService, private ngZone: NgZone, private _storyService: StoryService) {}

  initialise() {
    this.latlng = new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng);
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.latlng,
      zoom: 4
    });

      this._storyService.getStories().subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
  }

  // parse them and add them to map
  successfulRetrieve(stories: Story[]) {
    // TODO remove this when migrating environments - find a way to get this from env var

    const baseServerUrl = 'http://localhost:3000';

    for (const story of stories) {
      // need to reverse location as coming out of the db long lat
      let position = null;
      this.log.debug('stories.length=' + stories.length);
      if(!isUndefined(story.loc.coordinates))
      {
        position = new google.maps.LatLng(story.loc.coordinates[1], story.loc.coordinates[0]);
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
        marker.setIcon('../assets/treeMarker.png');
        marker.addListener('click', event => {
          this.log.debug('Click called. Marker title=' + marker.getTitle());
          this.log.debug('Click called. content=' + story.content);
          const infowindow = new google.maps.InfoWindow({
            content: content,
            position: marker.getPosition(),
            maxWidth: 200
          });
          infowindow.open(this.map);
        });
        this.markers.push(marker);
        // now draw rectangle
        if (story.shapeType != null){
          if (story.shapeType === 'rectangle') {
            //SW then NE
            const SW = new google.maps.LatLng(story.SWCoords.coordinates[0], story.SWCoords.coordinates[1]);
            const NE = new google.maps.LatLng(story.NECoords.coordinates[0], story.NECoords.coordinates[1]);
            const myBounds = new google.maps.LatLngBounds(SW, NE);
            const rectangle = new google.maps.Rectangle();
            rectangle.setBounds(myBounds);
            rectangle.setMap(this.map);
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
        }
      }
      else
      {
        this.log.error('can\'t map story id'+ story._id + 'as it has no location');
      }

    }

    }


  failedRetrieve(error: any) {
    this.log.error('failed retrieve: ' + error);
    this.errorMsg = error;

  }



  ngOnInit() {
    this.googleApi.initMap().then(() => {

    this.initialise();


     // Create the search box and link it to the UI element.
     this.searchBox = new google.maps.places.SearchBox(this.searchElementRef.nativeElement);
      const defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631));
      this.searchBox.setBounds(defaultBounds);

      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.searchElementRef.nativeElement);
      // Bias the SearchBox results towards current map's viewport.

      this.map.addListener('bounds_changed', e => {

        if (this.map.getBounds() !== undefined) {
          this.searchBox.setBounds(this.map.getBounds());
        } else {
          console.log('getBounds is undefined');
        }


      });


      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place. The listener needs to run in its own zone
      // otherwise the DOM doesn't refresh properly
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
          this.onPlaceChanged.emit(posString);



        });


      }); // end places changed


        this.map.addListener('click', e => {
        // placeMarkerAndPanTo(e.latLng, this.map);
        // console.log('map click detected at lat', e.latLng.lat().valueOf());
        // this.story.locationLat = e.latLng.lat();
        // this.testfunconclass(e.latLng.lat());
          this.map.panTo(e.latLng);
          // this.onPositionChanged.emit(e.latLng.toString());
      });



    }); // end initMap

   }// end ngoninit





}
