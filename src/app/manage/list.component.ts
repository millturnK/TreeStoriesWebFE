import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../user/models/user';
import {Story} from '../models/story';
import {StoryService} from '../services/story.service';
import {loggerFactory} from '../config/ConfigLog4j';

@Component({
  selector: 'app-list-stories',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class StoryListComponent implements OnInit {

  title = 'Your Tree Stories';
  stories: Story[]= [];
  selectedStory: Story;
  failureMsgHeader = '';
  failureMsg = '';
  success = false;
  errorMessage = '';
  deleteCandidate = null;



  private log = loggerFactory.getLogger('component.ListStory');

  constructor(private _router: Router, private route: ActivatedRoute,
              private _user: User, private _storyService: StoryService) {

  }

  ngOnInit() {

    this.log.debug('in ngOnit');
    this._storyService.getUsersStories(this._user).subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
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
  userFriendlyDate(creationDate): string{
    const friendlyDate = new Date(Date.parse(creationDate));

    return friendlyDate.toDateString();
  }

  storySelected(index: number) {
    this.log.debug('selected: ' + index + ', =' + this.stories[index].title);
    this.selectedStory = this.stories[index];
    this.log.debug('checking input setup correctly: ' + this.selectedStory.title);

  }


  edit(index: number) {
    this.log.debug('edit: ' + index + ', =' + this.stories[index].title + ',id=' + this.stories[index]._id );
    this._router.navigate(['/edit', this.stories[index]._id ]);

  }

  delete(index: number) {
    this.log.debug('delete: ' + index + ', =' + this.stories[index].title);
    this.deleteCandidate = index;
    // this._storyService.delete(this.stories[index]._id, this._user ).subscribe((results: string) => this.successfulDelete(results),
    //   error => this.failedDelete(<any>error));
  }
  abandonDelete() {
    /*console.log("I changed my mind ");*/
    this.deleteCandidate = null;
  }

  confirmDelete() {
    /*console.log("Ok, I'm doing it delete: ", this.accounts[this.deleteCandidate].username);*/

    this._storyService.delete(this.stories[this.deleteCandidate]._id, this._user ).subscribe((results: string) => this.successfulDelete(results),
      error => this.failedDelete(<any>error));


  }
  private successfulDelete(result: string) {
    //set success message
    this.success = true;
  }

  private failedDelete(error: any) {
    this.success = false;
    this.failureMsgHeader = 'Story delete failed';
    this.errorMessage = 'Unable to delete story. Error = ' + error;
  }



}



