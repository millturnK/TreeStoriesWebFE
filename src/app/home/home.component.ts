import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../user/models/user';
import {Story} from '../models/story';
import {StoryService} from '../services/story.service';
import {loggerFactory} from '../config/ConfigLog4j';
import {FormControl} from '@angular/forms';



declare var jQuery: any;
declare var google: any;
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
  panPosition: google.maps.LatLng;
  modalImg;
  modal;
  // ckShowAll = new FormControl('');
  ckShowAllChecked = false;

  private log = loggerFactory.getLogger('component.Home');


  constructor(private elementRef: ElementRef, private _router: Router, private route: ActivatedRoute, public _user: User,
              private _storyService: StoryService) {

  }

  showAll(){
    this.log.debug('show all clicked');
    // get all stories

    this.ckShowAllChecked = this.ckShowAllChecked ? false : true;

    this.log.debug('show all value = ' + this.ckShowAllChecked);


  //  if(this.ckShowAllChecked === false){
  //    this.ckShowAllChecked = true;
  //  }
    if (this.ckShowAllChecked){
      this._storyService.getStories().subscribe( (results: Story[]) => this.successfulRetrieve(results),
        error => this.failedRetrieve(<any>error));
      //this.ckShowAllChecked = false;
    }
    // if not clicked, remove stories somehow...later. TODO save the existing story array and reset
    else{
      this.stories = this.prevStories;
    }



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


    this.log.debug('in ngOnit');
    this._storyService.getStories().subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
  }
  panToStoryLocation(coords){

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
    //const photoUrl = this.stories[i].photoLinks[0];
    const photoUrl = uri;
      // Get the image and insert it inside the modal - use its "alt" text as a caption
    // const img = document.getElementById('photo' + i);

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
    //this.log.debug('in getStories. Length is ' + this.stories.length);
    return this.stories;
  }

  successfulRetrieve(stories: Story[]) {
    //this.log.debug('Home Component SuccRet got stories of length' + stories.length);

    // throw away what is there
    this.stories = [];
    this.stories = stories;

  }
  successfulRetrieveFocusedSearch(stories: Story[]) {
    //this.log.debug('Home Component SuccRet got stories of length' + stories.length);

    // throw away what is there
    this.stories = [];
    this.stories = stories;
    this.prevStories = stories;
  }

  failedRetrieve(error: any) {
    // handle error
    this.log.debug('Error:' + error);

  }



  onPlaceChanged(newPos) {
    // set value of text box
    this.stories= [];
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

}



