import {Component, OnInit} from '@angular/core';
import {User} from '../user/models/user';
import {Router} from '@angular/router';
import {Story} from '../models/story';
import {Validators, FormControl, FormGroup} from '@angular/forms';
//import {TellService} from './services/tell.service';
import {loggerFactory} from '../config/ConfigLog4j';
import {Picture} from '../models/picture';
import {StoryService} from '../services/story.service';
import {isUndefined} from 'util';
declare const google: any;


function latitudeValidator(control: FormControl): { [s: string]: boolean } {

  //console.log('in lat val. control=', control);
  const pattern =  /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
  return control.value.match(pattern) ? null : {pattern: true};


}
function longitudeValidator(control: FormControl): { [s: string]: boolean } {

  //console.log('in long val. control=', control);
  const pattern =  /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
  return control.value.match(pattern) ? null : {pattern: true};

}

@Component({
    selector: 'tell-form',
    templateUrl: 'tell.component.html'
})
// TODO allow upload of up to 5 photos
export class TellComponent
{
   // ngOnInit (){
   //
   //
   // }
  title = new FormControl('', Validators.required);
  botName = new FormControl('');
  description= new FormControl('', Validators.required);
  source= new FormControl('', Validators.required);
  coordChoice = new FormControl('singleTree');
  // TODO getting error can't match value of undefined
  //latitude = new FormControl('', [Validators.required, latitudeValidator]);
  //longitude = new FormControl('', [Validators.required, longitudeValidator]);
  latitude = new FormControl('', [Validators.required, latitudeValidator]);
  longitude = new FormControl('', [Validators.required, longitudeValidator]);
  ckMap  = new FormControl('');
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
   // form controls & group needed to unpin this form
  latitudeValPattern = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;


  success = false;
  errorMessage = '';
  private log = loggerFactory.getLogger('component.GoogleMaps');

  storyModel: Story = new Story();
  pictures: Picture[] = [];


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
      // round to 6 dec places
    this.latitude.setValue(newPos.lat().toFixed(6));
    this.longitude.setValue(newPos.lng().toFixed(6));
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
    this.tellStoryForm.reset();

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
