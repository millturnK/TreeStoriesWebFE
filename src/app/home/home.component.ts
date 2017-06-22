import {
  Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../user/models/user';
import {Story} from '../models/story';
import {StoryService} from '../services/story.service';
import {loggerFactory} from '../config/ConfigLog4j';
import {Place} from '../models/Place';



declare var jQuery: any;
// declare var google: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
// TODO change to display all thumbnails of photos
export class HomeComponent implements OnInit, OnDestroy {

  imageToShow: string;
  showModal: boolean;
  title = 'Tree Stories';
  stories: Story[]= [];
  prevStories: Story[]= [];
  private sub: any;
  private logout = false;

  // This is the initial point on which the map is centred
  centreMap: google.maps.LatLng;

  // This is the point on which the map is focussed, all distances calculated from here
  panPosition: google.maps.LatLng;

  // attributes related to pagination
  // only display this many stories at a time
  displayPageSize = 3;
  // whenever you go to the database get this many, make sure this is at least twice display size
  retrieveDocNum = 10;
  // these define where the user current is currently looking within the overall story list
  startIndex = 0;
  endIndex = 0;

  // modal attributes
  modalImg;
  modal;
  // ckShowAll = new FormControl('');
  ckShowAllChecked = false;

  private log = loggerFactory.getLogger('component.Home');


  constructor(private elementRef: ElementRef, private _router: Router, private route: ActivatedRoute, public _user: User,
              private _storyService: StoryService) {

  }

  showAll() {
    this.log.debug('show all clicked');
    // get all stories

    this.ckShowAllChecked = this.ckShowAllChecked ? false : true;

    this.log.debug('show all value = ' + this.ckShowAllChecked);


  //  if(this.ckShowAllChecked === false){
  //    this.ckShowAllChecked = true;
  //  }
    if (this.ckShowAllChecked) {
      this._storyService.getStories().subscribe( (results: Story[]) => this.successfulRetrieve(results),
        error => this.failedRetrieve(<any>error));
      // this.ckShowAllChecked = false;
    } else {
    // if not clicked, remove stories somehow...later. TODO save the existing story array and reset
      this.stories = this.prevStories;
    }



  }

  showPosition(position) {
 this.log.debug('showPos. Lat= ' + position.coords.latitude + 'long' + position.coords.longitude);
}
  ngOnInit() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    }

    // set the initial position
    this.centreMap = new google.maps.LatLng(-25.363, 131.044);

    this.sub = this.route.params.subscribe(params => {
      // search for a logout parameter if it is present
      this.logout = params['logout'];

      if (this.logout) {
        console.log('Logout request in home route', this.logout);

        this.logoutUser();

      }

    });


    this.log.debug('Retrieve initial stories');
    // this will go and grab a larger number of stories
    this._storyService.getPageStories(this.retrieveDocNum).subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
    // this._storyService.getStories( ).subscribe( (results: Story[]) => this.successfulRetrieve(results),
    //  error => this.failedRetrieve(<any>error));
  }


  panToStoryLocation(coords) {

    this.log.debug('in panToStoryLocation. Coords=' + coords);
    const panTo = new google.maps.LatLng(coords[1], coords[0]);
    const posString = coords[1] + ',' + coords[0];
   // this.onPanTo.emit(posString);
    this.panPosition = panTo;
    this.log.debug('in panToStoryLocation. panPosition=' + this.panPosition);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private logoutUser() {

    console.log('Dropping user from localstorage');
    localStorage.removeItem('currentUser');

    this._user.clear();

  }
  login() {
    // console.log('Login clicked');
    if (!this._user.loggedin) {
      this._router.navigate(['login']);
    }

  }
  showEnlargedPhoto(uri) {
    this.log.debug('in showEnlargedPhoto.uri=' + uri);
    const photoUrl = uri;

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    this.modalImg = jQuery(this.elementRef.nativeElement).find('#img01');
    this.modal = jQuery(this.elementRef.nativeElement).find('#myModal');

    console.log('modal = ', this.modal);
    console.log('img = ', this.modalImg);

    this.modalImg.src = photoUrl;

    console.log('was I am to set img?', this.modalImg);

    //this.modal.style.display = 'block';
    this.showModal = true;
    this.imageToShow = photoUrl;

    console.log('was I able to set display?', this.modal);

  }

  closeModal() {
//    document.getElementById('myModal').style.display='none'
    this.showModal = false;
  }

  getStories() {

    // just return what the user should see
    this.log.debug('show user stories: [' + this.startIndex + '..' + (this.endIndex - 1) + ']');

    const temp = [];
    let tempIdx = 0;

    for ( let i = this.startIndex; i < this.endIndex; i++) {
      temp[tempIdx++] = this.stories[i];
    }

    return temp;

    // return this.stories;
  }

  successfulRetrieve(stories: Story[]) {

    // how many stories did you get?
    this.log.debug('Retrieved: ' + stories.length + ' stories');
    // throw away what is there
    this.stories = [];
    this.stories = stories;

    this.startIndex = 0;
    // if the number of stories is greater than the display page size, then only
    this.endIndex = this.stories.length > this.displayPageSize ? this.displayPageSize : this.stories.length;

  }

  successfulRetrieveFocusedSearch(stories: Story[]) {
    // this.log.debug('Home Component SuccRet got stories of length' + stories.length);

    // throw away what is there
    this.stories = [];
    this.stories = stories;

    // set the indexes
    this.startIndex = 0;
    // if the number of stories is greater than the display page size, then only
    this.endIndex = this.stories.length > this.displayPageSize ? this.displayPageSize : this.stories.length;

    this.prevStories = stories;
  }

  successfulPageRetrieve(stories: Story[]) {

    // how many stories did you get?
    this.log.debug('Page Retrieved: ' + stories.length + ' stories, adding to total.');
    // silently add on the new stories
    this.stories = this.stories.concat(stories);
    this.log.debug('Story[] len = ' + this.stories.length);

  }


  failedRetrieve(error: any) {
    // handle error
    this.log.debug('Error:' + error);

  }


  onPlaceChanged(newPos) {
    // set value of text box
    this.stories = [];
    this.log.debug('onPlace changed called with' + newPos);
    this._storyService.getStoriesWithinRadiusPoint(newPos).subscribe( (results: Story[]) => this.successfulRetrieveFocusedSearch(results),
      error => this.failedRetrieve(<any>error));
    // TODO this isn't being set with the new stories
  }

  // TODO implement only going here if user is logged in
  openTell() {
    console.log('in openTell');
    this._router.navigate(['tell']);

  }

  // TO DO - put markers on map - do we share one map or can we have two different instances of the component?

  previousPage() {
    if (this.startIndex === 0) {
      this.log.debug('Previous disabled');
      return;
    }
    this.log.debug('Get previous page of data');
    this.startIndex = this.startIndex - this.displayPageSize;
    this.endIndex = this.startIndex + this.displayPageSize;
  }

  nextPage() {
    if (this.endIndex >= this.stories.length) {
      this.log.debug('Next disabled');
      return;
    }
    this.log.debug('Get next page of data');

    // check whether we need to go retrieve more? If this is the last page then yes
    if (this.stories.length - this.endIndex < (2 * this.displayPageSize)) {
      // better go try and get some more...
      // get last index of story and retrieve the next bunch of stories
      const lastId = this.stories[this.stories.length - 1]._id;

      // now need to work out how far away the last story is and then go get the next page of stories that are
      // greater than that minimum distance.
      const minLoc: Place = this.stories[this.stories.length - 1].loc;

      const minDistance = this.getDistanceFromLatLonInKm(minLoc.coordinates[0], minLoc.coordinates[1], this.panPosition.lat(), this.panPosition.lng());


      this.log.debug('Get stories from minDistance = ' + minDistance * 1000);


      this.log.debug('Get stories from id = ' + lastId);

      this._storyService.getPageStories(this.retrieveDocNum, lastId).subscribe( (results: Story[]) => this.successfulPageRetrieve(results),
        error => this.failedRetrieve(<any>error));
    }

    // now just shuffle along the indexes
    this.startIndex = this.startIndex + this.displayPageSize;
    if (this.startIndex + this.displayPageSize > this.stories.length ) {
      this.endIndex = this.stories.length;
    } else {
      this.endIndex = this.startIndex + this.displayPageSize;
    }

  }

  previousEnabled() {
    if (this.startIndex > 0) {
      return 'previous';
    }
    return 'previous disabled';
  }

  nextEnabled() {
    if (this.endIndex < this.stories.length) {
      return 'next';
    }
    return 'next disabled';
  }


  /*
    Haversine formula
   */
  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number , lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
       Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
       Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt( 1 - a ));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
     return deg * (Math.PI / 180 );
  }



}



