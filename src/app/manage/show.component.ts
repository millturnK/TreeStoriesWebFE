import {Component, Input, OnChanges} from '@angular/core';
import {User} from '../user/models/user';
import {Router} from '@angular/router';
import {Story} from '../models/story';
import {Validators, FormControl, FormGroup} from '@angular/forms';
import {loggerFactory} from '../config/ConfigLog4j';
import {Picture} from '../models/picture';
import {StoryService} from '../services/story.service';


@Component({
    selector: 'show-story-form',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnChanges {

  title = new FormControl('');
  botName = new FormControl('');
  description = new FormControl('');

  storyForm = new FormGroup({
    title: this.title,
    botName: this.botName,
    description: this.description,

  });

  private log = loggerFactory.getLogger('component.Show');

  pictures: Picture[] = [];

  @Input() story: Story;

  constructor(private router: Router, private _user: User, private _storyService: StoryService) {

  }


  ngOnChanges() {

    this.log.debug('change to input, displaying... ' + this.story.title);

    this.storyForm.reset({
        title: this.story.title,
        botName: this.story.botName,
        description: this.story.content
    });

    // do I have the story photolinks here?
    this.log.debug('photolinks = ' + this.story.photoLinks);

  }



  onSubmit() {
      //console.log('submit');

    }




}
