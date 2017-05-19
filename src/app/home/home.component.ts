import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user/models/user';
import {Story} from '../models/story';
import {StoryService} from '../services/story.service';
import {loggerFactory} from '../config/ConfigLog4j';

declare const google: any;
@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  title = 'Tree Stories';
  stories: Story[];
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
  successfulRetrieve(stories: Story[]){
    this.log.debug('SuccRet got stories of length' + stories.length);
    this.stories = stories;
  }

  failedRetrieve(error: any){
    // handle error
    this.log.debug('Error:' + error);

  }



  //TODO implement only going here if user is logged in
  //TODO implement logging
  openTell()
  {
    console.log('in openTell');
    this._router.navigate(['tell']);

  }

  //TO DO - put markers on map - do we share one map or can we have two different instances of the component?

}



