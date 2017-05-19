import {Component, OnInit} from '@angular/core';
import {User} from '../user/models/user';
import {Router} from '@angular/router';
import {Story} from '../models/story';
import {Validators, FormControl, FormGroup} from '@angular/forms';
//import {TellService} from './services/tell.service';
import {loggerFactory} from '../config/ConfigLog4j';
import {Picture} from '../models/picture';
import {StoryService} from '../services/story.service';
declare const google: any;

@Component({
    selector: 'tell-form',
    templateUrl: 'tell.component.html'
})
// TODO allow upload of up to 5 photos
export class TellComponent
{
  // form controls & group needed to unpin this form
  title = new FormControl('', Validators.required);
  botName = new FormControl('');
  description= new FormControl('', Validators.required);
  source= new FormControl('', Validators.required);
  coordChoice = new FormControl('singleTree');
  latitude = new FormControl('');
  longitude = new FormControl('');
  ckMap  = new FormControl('');
  success = false;
  errorMessage = '';
  private log = loggerFactory.getLogger('component.GoogleMaps');

  storyModel: Story = new Story();
  pictures: Picture[] = [];

  tellStoryForm = new FormGroup({
    title: this.title,
    botName: this.botName,
    description: this.description,
    source: this.source,
    coordChoice: this.coordChoice,
    latitude: this.latitude,
    longitude: this.longitude,
    ckMap: this.ckMap
    // coordChoiceArea: this.coordChoiceArea
  });
    constructor(private router: Router, private _user: User, private _storyService: StoryService) {
        /*this.storyModel = new Story();*/
        // TODO implement login and pass in name, remove placeholder
        _user.username = 'Katie Test';
        this.storyModel.contributors = _user.username;
    }



   // onPositionChanged(newPos: string){
  onPositionChanged(newPos) {
     //set value of text box
      console.log('onPosition changed called with', newPos);
    this.latitude.setValue(newPos.lat());
    this.longitude.setValue(newPos.lng());
    }


  onSubmit() {
      console.log('submit');

      const title = this.title.value;
      const botName = this.botName.value;
      const description = this.description.value;
      const source = this.source.value;

      this.storyModel.title = title;
      this.storyModel.botName = botName;
      this.storyModel.content = description;
      this.storyModel.contributors = source;
      this.storyModel.latitude = this.latitude.value;
      this.storyModel.longitude = this.longitude.value;
      console.log('onSubmit $event.file=', event);

    this._storyService.postStory(this.storyModel, this.pictures).subscribe( result => this.successfulSubmit(),
      error => this.failedSubmit(<any>error));

    }

  private successfulSubmit() {

    /*console.log("successful submit");*/
    this.success = true;
    // setTimeout(() => { // 3
    //   this._router.navigate(["/curate"]);
    // }, 4000);
  }
  imageUploaded($event){
      this.log.debug('imageUploaded called');
     console.log('imageUploaded called. Event.file:', $event.file);
      //pull out lat.lng
    this.pictures.push(new Picture(<File> $event.file));
  }

  private failedSubmit(error: any) {
    /*console.log("failedSubmit called: ", error);*/
    this.success = false;
    this.errorMessage = error;
  }

    /*locate(){
       // alert("Locate called");
        this.router.navigate(["/locate"]);
    }*/


  isSingleTree(): boolean {
    if (this.coordChoice.value === 'singleTree') {
      console.log('single tree checked: ', this.coordChoice.value);
      return true;
    }
    return false;
  }


}
