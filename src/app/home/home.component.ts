import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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
export class HomeComponent implements OnInit {
  title = 'Tree Stories';
  stories: Story[]= [];

  private log = loggerFactory.getLogger('component.Home');
  constructor(private _router: Router, private _user: User, private _storyService: StoryService)
  {

  }
  ngOnInit()
  {
    this.log.debug('in ngOnit');
    this._storyService.getStories().subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
  }
  getStories(){
    this.log.debug('in getStories. Length is ' + this.stories.length);
    return this.stories;
  }

  successfulRetrieve(stories: Story[]) {
    this.log.debug('Home Component SuccRet got stories of length' + stories.length);

    // throw away what is there
    this.stories = [];
    this.stories = stories;

//     // iterate through whatever we got back and just extract a couple of things for now
//     for (const sty of stories) {
//       const story = new Story();
//       story.title = sty.title;
//       story.content = sty.content;
//       story.contributors = sty.contributors;
//       story.photoLinks = sty.photoLinks;
//       story.latitude = sty.latitude;
//       story.longitude = sty.longitude;
//       console.log("Adding a story: ", story.title);
//       this.stories.push( story );
//     }
//
// //    this.stories = stories;
// //    console.log(this.stories);
//     this.figtree = 'New value 5556';
  }

  failedRetrieve(error: any){
    // handle error
    this.log.debug('Error:' + error);

  }



  onPlaceChanged(newPos) {
    // set value of text box
    this.log.debug('onPlace changed called with'+ newPos);
    this._storyService.getStoriesWithinRadiusPoint(newPos).subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
    // TODO this isn't being set with the new stories
  }

  //TODO implement only going here if user is logged in
  openTell()
  {
    console.log('in openTell');
    this._router.navigate(['tell']);

  }

  //TO DO - put markers on map - do we share one map or can we have two different instances of the component?

}



