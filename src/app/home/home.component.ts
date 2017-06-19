import {
  Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../user/models/user';
import {Story} from '../models/story';
import {StoryService} from '../services/story.service';
import {loggerFactory} from '../config/ConfigLog4j';



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
  private sub: any;
  private logout = false;
  private register = false;
  @Output() onPanTo = new EventEmitter<string>();
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

  private log = loggerFactory.getLogger('component.Home');


  constructor(private elementRef: ElementRef, private _router: Router, private route: ActivatedRoute, public _user: User,
              private _storyService: StoryService) {

  }

  ngOnInit() {

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
    this.log.debug('onPlace changed called with' + newPos);
    this._storyService.getStoriesWithinRadiusPoint(newPos).subscribe( (results: Story[]) => this.successfulRetrieve(results),
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




}



