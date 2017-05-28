import {Component, OnChanges, Input, EventEmitter, Output, ElementRef, ViewChild, NgZone} from '@angular/core';
import {GoogleApiService} from '../services/google-api.service';
import {loggerFactory} from '../config/ConfigLog4j';

import {Location} from '../models/Location';

@Component({
  selector: 'app-map-displayonly',
  templateUrl: './displayonly-map.component.html',
  styleUrls: ['./displayonly-map.component.css']
})
export class DisplayOnlyMapComponent implements OnChanges {

  // @Output() onPlaceChanged = new EventEmitter<string>();

 // @ViewChild('search')
 // public searchElementRef: ElementRef;

  @Input() location: Location;

//  myLatLng = {lat: -25.363, lng: 131.044};
  map: any;
  // treeMarker: any;
//  input: any;
//  searchBox: any;
//  latlng;
  // zoom level for map
  zoom = 12;


  private log = loggerFactory.getLogger('component.GoogleMaps');


  constructor(private googleApi: GoogleApiService, private ngZone: NgZone) {}



  ngOnChanges() {
    this.googleApi.initMap().then(() => {

      // grab the location and display that, assume point for now...
      const latlng = new google.maps.LatLng(this.location.coordinates[1], this.location.coordinates[0]);
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: latlng,
        zoom: this.zoom
      });

      //const position = new google.maps.LatLng(story.latitude, story.longitude);
      const marker = new google.maps.Marker();
      marker.setPosition(latlng);
      marker.setMap(this.map);


    });
  }  // end ngoninit




}
