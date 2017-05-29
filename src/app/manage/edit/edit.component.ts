import {Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../user/models/user';
import {StoryService} from '../../services/story.service';
import {loggerFactory} from '../../config/ConfigLog4j';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Picture} from '../../models/picture';
import {Story} from '../../models/story';
import {CoordsFromPhoto} from '../../tell/coordsFromPhoto';
import {isUndefined} from 'util';
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
// TODO resolve which map to use and listening to pos changed events
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnChanges {
  private log = loggerFactory.getLogger('component.Edit');
  private user: User = null;
  success = false;
  errorMessage = '';
  coordsAttr: Number[] = [];
  coordsFromPhoto = new CoordsFromPhoto();
  editedStory: Story = null;

  storyModel: Story = new Story();
  pictures: Picture[] = [];


  title = new FormControl('', Validators.required);
  botName = new FormControl('');
  description= new FormControl('', Validators.required);
  contributor= new FormControl('');
  source= new FormControl('', Validators.required);
  coordChoice = new FormControl('singleTree');
  latitude = new FormControl('', latitudeValidator);
  longitude = new FormControl('', longitudeValidator);
  ckMap  = new FormControl('');
  bbPointsTopLeftLat = new FormControl('');
  bbPointsTopLeftLng = new FormControl('');
  bbPointsBottomRightLat = new FormControl('');
  bbPointsBottomRightLng = new FormControl('');

  editStoryForm = new FormGroup({
    title: this.title,
    botName: this.botName,
    description: this.description,
    contributor: this.contributor,
    source: this.source,
    coordChoice: this.coordChoice,
    latitude: this.latitude,
    longitude: this.longitude,
    ckMap: this.ckMap,
    bbPointsTopLeftLat: this.bbPointsTopLeftLat,
    bbPointsTopLeftLng: this.bbPointsTopLeftLng,
    bbPointsBottomRightLat: this.bbPointsBottomRightLat,
    bbPointsBottomRightLng: this.bbPointsBottomRightLng


    // coordChoiceArea: this.coordChoiceArea
  });

  constructor(private _router: Router, private route: ActivatedRoute,
              private _user: User, private _storyService: StoryService) {
    this.user = _user;
    this.storyModel.contributors = _user.username;
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.log.debug('in ngOnInit. Id=' + id);
    this.coordsFromPhoto.coordsSubject.subscribe((coords: Number[]) => {
      this.coordsAttr = coords;
      this.latitude.setValue(this.coordsAttr[0].toFixed(6));
      this.longitude.setValue(this.coordsAttr[1].toFixed(6));
    });
    this._storyService.getStoryByID(this.user, id).subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
  }
  ngOnChanges() {

    this.log.debug('change to input, displaying... ' + this.editedStory.title);

    this.editStoryForm.reset({
      title: this.editedStory.title,
      botName: this.editedStory.botName,
      description: this.editedStory.content,
      contributor: this.editedStory.contributors,
      sources: this.editedStory.sources,
      latititude: this.editedStory.latitude,
      longitude: this.editedStory.longitude

    });

    // do I have the story photolinks here?
    //this.log.debug('photolinks = ' + this.story.photoLinks);

  }
  private successfulRetrieve(stories: Story[]) {

    // assuming only one matching that ID!!!
    this.editedStory = stories[0];
    //console.log("successful retrieve: ", this.nfr);
    // now populate the fields

    this.title.setValue(this.editedStory.title);
      this.botName.setValue(this.editedStory.botName);
      this.description.setValue(this.editedStory.content);
      this.contributor.setValue(this.editedStory.contributors);
      this.source.setValue(this.editedStory.sources);
      this.latitude.setValue(this.editedStory.latitude);
      this.longitude.setValue(this.editedStory.longitude);

    }

  private failedRetrieve(error: any) {
    /*console.log("failed retrieve: ", error);*/
    this.log.debug("failed retrieve: " + error.message);

  }



// onPositionChanged(newPos: string){
onPositionChanged(newPos) {
  // set value of text box
  console.log('onPosition changed called with', newPos);
  // round to 6 dec places
  this.latitude.setValue(newPos.lat.toFixed(6));
  this.longitude.setValue(newPos.lng.toFixed(6));
}
onRectPositionChanged(newPos){
  this.log.debug("Yay, I am in onRectPositionChanged. newPos=" + newPos);
  // somehow parse it!
}


onSubmit() {
  console.log('submit');

  const title = this.title.value;
  const botName = this.botName.value;
  const description = this.description.value;
  const source = this.source.value;
  const contributor = this.contributor.value;

  this.storyModel.title = title;
  this.storyModel.botName = botName;
  this.storyModel.sources = source;
  this.storyModel.content = description;
  this.storyModel.latitude = this.latitude.value;
  this.storyModel.longitude = this.longitude.value;
  console.log('onSubmit $event.file=', event);

  this._storyService.updateStory(this.storyModel, this.pictures).subscribe( result => this.successfulSubmit(),
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
  this.source.reset('');
  this.contributor.reset('');
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
