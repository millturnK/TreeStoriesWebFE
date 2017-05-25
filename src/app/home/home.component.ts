import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../user/models/user';
import {Story} from '../models/story';
import {StoryService} from '../services/story.service';
import {loggerFactory} from '../config/ConfigLog4j';

declare const google: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'Tree Stories';
  stories: Story[]= [];
  private sub: any;
  private logout = false;
  private register = false;


  private log = loggerFactory.getLogger('component.Home');
  constructor(private _router: Router, private route: ActivatedRoute, private _user: User, private _storyService: StoryService) {

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


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private logoutUser() {

    console.log('Dropping user from localstorage');
    localStorage.removeItem('currentUser');

    this._user.clear();

  }


  getStories() {
    this.log.debug('in getStories. Length is ' + this.stories.length);
    return this.stories;
  }

  successfulRetrieve(stories: Story[]) {
    this.log.debug('Home Component SuccRet got stories of length' + stories.length);

    // throw away what is there
    this.stories = [];
    this.stories = stories;
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

}



