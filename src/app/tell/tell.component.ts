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
import {CoordsFromPhoto} from './coordsFromPhoto';
declare const google: any;


function latitudeValidator(control: FormControl): { [s: string]: boolean } {

  console.log('in lat val. control=', control);
  const pattern =  /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
  return control.value.match(pattern) ? null : {pattern: true};


}
function longitudeValidator(control: FormControl): { [s: string]: boolean } {

  console.log('in long val. control=', control);
  const pattern =  /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
  return control.value.match(pattern) ? null : {pattern: true};

}

@Component({
    selector: 'tell-form',
    templateUrl: 'tell.component.html'
})
// TODO allow upload of up to 5 photos
export class TellComponent {

  title = new FormControl('', Validators.required);
  botName = new FormControl('');
  description= new FormControl('', Validators.required);
  source= new FormControl('', Validators.required);
  coordChoice = new FormControl('singleTree');
  latitude = new FormControl('', latitudeValidator);
  longitude = new FormControl('', longitudeValidator);
  ckMap  = new FormControl('');
  coordsAttr: Number[] = [];
  //let input = Observable.bindCallback()
  //coordsSubject = new Subject();
  coordsFromPhoto = new CoordsFromPhoto();

  ngOnInit() {
    this.coordsFromPhoto.coordsSubject.subscribe((
      coords:Number[])=>{
      this.coordsAttr= coords;
      this.latitude.setValue(this.coordsAttr[0].toFixed(6));
      this.longitude.setValue(this.coordsAttr[1].toFixed(6));
    });
  }

  tellStoryForm = new FormGroup({
    title: this.title,
    botName: this.botName,
    description: this.description,
   // source: this.source,
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
        // _user.username = 'Katie Test';
        this.storyModel.contributors = _user.username;
    }


   // onPositionChanged(newPos: string){
  onPositionChanged(newPos) {
     // set value of text box
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


    }

  private successfulSubmit() {

    /*console.log("successful submit");*/
    this.success = true;
    // setTimeout(() => { // 3
    //   this._router.navigate(["/curate"]);
    // }, 4000);
    //this.tellStoryForm.reset();
    this.resetForm();
  }


  private resetForm() {

      // manually resetting all the fields. Have seen some funny behaviour when resetting a whole form group
    this.title.reset('');
    this.botName.reset('');
    this.description.reset('');
    this.latitude.reset('');
    this.longitude.reset('');
    // and close the map
    this.ckMap.setValue(false);
  }




  imageUploaded($event) {
    this.log.debug('imageUploaded called');
     console.log('imageUploaded called. Event.file:', $event.file);
      // pull out lat.lng
    this.pictures.push(new Picture(<File> $event.file));
    this.coordsFromPhoto.getCoordsFromPhoto($event.file);
  }

  private failedSubmit(error: any) {
    /*console.log("failedSubmit called: ", error);*/
    this.success = false;
    this.errorMessage = error;
  }


  // TODO display map drawing tool accordingly
  isSingleTree(): boolean {
    if (this.coordChoice.value === 'singleTree') {
      console.log('single tree checked: ', this.coordChoice.value);
      return true;
    }
    return false;
  }



}
