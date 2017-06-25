import {Component, ElementRef, EventEmitter, NgZone, OnChanges, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../user/models/user';
import {StoryService} from '../../services/story.service';
import {loggerFactory} from '../../config/ConfigLog4j';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Picture} from '../../models/picture';
import {Story} from '../../models/story';
import {CoordsFromPhoto} from '../../tell/coordsFromPhoto';
import {isUndefined} from 'util';
import {Place} from '../../models/Place';


declare const google: any;
declare var jQuery: any;


function latitudeValidator(control: FormControl): { [s: string]: boolean } {

  console.log('in lat val. control=', control.value);
  const pattern =  /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
  return control.value.match(pattern) ? null : {pattern: true};


}
function longitudeValidator(control: FormControl): { [s: string]: boolean } {

  console.log('in long val. control=', control.value);
  const pattern =  /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
  return control.value.match(pattern) ? null : {pattern: true};

}
// TODO resolve which map to use and listening to pos changed events
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  private log = loggerFactory.getLogger('component.Edit');
  private user: User = null;
  success = false;
  errorMessage = '';
  coordsAttr: Number[] = [];
  coordsFromPhoto = new CoordsFromPhoto();
  editedStory: Story = null;

  storyModel: Story = new Story();
  pictures: Picture[] = [];
 // @Output() onPositionChangedFromPhoto = new EventEmitter<google.maps.LatLng>();
  private photoLoc: google.maps.LatLng;



  title = new FormControl('', Validators.required);
  botName = new FormControl('');
  description= new FormControl('', [Validators.required, Validators.minLength(140)]);
  contributor= new FormControl('');
  source= new FormControl('', Validators.required);
  latitude = new FormControl('', latitudeValidator);
  longitude = new FormControl('', longitudeValidator);
  ckMap  = new FormControl('');

  editStoryForm = new FormGroup({
    title: this.title,
    botName: this.botName,
    description: this.description,
    contributor: this.contributor,
    source: this.source,
    latitude: this.latitude,
    longitude: this.longitude,
    ckMap: this.ckMap

    // coordChoiceArea: this.coordChoiceArea
  });

  constructor(private _router: Router, private ngZone: NgZone, private route: ActivatedRoute,
              private _user: User, private _storyService: StoryService, private elementRef: ElementRef) {

    this.user = _user;
    this.storyModel.contributors = _user.username;
    this.storyModel.shapeType = this.storyModel.shapeTypeMarker;

  }

  ngOnInit() {

    // enable the tooltips
    jQuery(this.elementRef.nativeElement).find('[data-toggle="tooltip"]').tooltip();

    const id = this.route.snapshot.params['id'];
    this.log.debug('in ngOnInit. Id=' + id);
    this.storyModel._id = id;
    this.ngZone.run(() => {
      this.coordsFromPhoto.coordsSubject.subscribe((coords: number[]) => {
      this.log.debug('in coords');
      if (!isUndefined(coords) && coords.length > 0) {
        this.coordsAttr = coords;
        this.latitude.setValue(Number(this.coordsAttr[0]).toFixed(6));
        this.longitude.setValue(Number(this.coordsAttr[1]).toFixed(6));
        this.log.debug('set photo coords');
        // TODO change map pos
        // this.editedStory.loc.coordinates = coords;
        // this.onPositionChangedFromPhoto.emit(new google.maps.LatLng(Number(this.coordsAttr[0]), Number(this.coordsAttr[1]) ));
        this.photoLoc = new google.maps.LatLng(Number(this.coordsAttr[0]), Number(this.coordsAttr[1]));
        console.log('this.photoLoc=', this.photoLoc);
      }

    });
    });
    this._storyService.getStoryByID(this.user, id).subscribe( (results: Story[]) => this.successfulRetrieve(results),
      error => this.failedRetrieve(<any>error));
  }
  // ngOnChanges() {
  //
  //   this.log.debug('change to input, displaying... ' + this.editedStory.title);
  //
  //   this.editStoryForm.reset({
  //     title: this.editedStory.title,
  //     botName: this.editedStory.botName,
  //     description: this.editedStory.content,
  //     contributor: this.editedStory.contributors,
  //     sources: this.editedStory.sources,
  //     latititude: Number(this.editedStory.loc.coordinates[1]),
  //     longitude: Number(this.editedStory.loc.coordinates[0])
  //
  //   });
  //
  //   // do I have the story photolinks here?
  //   //this.log.debug('photolinks = ' + this.story.photoLinks);
  //
  // }
  private successfulRetrieve(stories: Story[]) {

    // assuming only one matching that ID!!!
    this.editedStory = stories[0];
    // now populate the fields

    this.title.setValue(this.editedStory.title);
      this.botName.setValue(this.editedStory.botName);
      this.description.setValue(this.editedStory.content);
      this.contributor.setValue(this.editedStory.contributors);
      this.source.setValue(this.editedStory.sources);
    if (!isUndefined(this.editedStory.loc.coordinates) && this.editedStory.loc.coordinates.length > 0) {
      this.latitude.setValue(this.editedStory.loc.coordinates[1].toString());
      this.longitude.setValue(this.editedStory.loc.coordinates[0].toString());
    }
    // set photoLnks
    this.storyModel.photoLinks = this.editedStory.photoLinks;



    }

  private failedRetrieve(error: any) {
    /*console.log("failed retrieve: ", error);*/
    this.log.debug('failed retrieve: ' + error.message);

  }



// onPositionChanged(newPos: string){
onPositionChanged(newPos) {
  // set value of text box
  this.log.debug('onPosition changed called with' + newPos);
  // round to 6 dec places
  this.latitude.setValue(Number(newPos.lat()).toFixed(6));
  this.longitude.setValue(Number(newPos.lng()).toFixed(6));
  this.storyModel.shapeType = '';
  this.storyModel.shapeType = this.storyModel.shapeTypeMarker;
}
onRectPositionChanged(newPos) {
  this.log.debug('onRecPositionChanged called with' + newPos);
  const centre = newPos.getCenter();
  this.latitude.setValue(Number(centre.lat()).toFixed(6));
  this.longitude.setValue(Number(centre.lng()).toFixed(6));
  const centreCoords = [Number(centre.lng().toFixed(6)), Number(centre.lat().toFixed(6))];

  this.storyModel.loc = new Place('Point', centreCoords);
  // this.storyModel.NECoords = newPos.getNorthEast().newPos.lat().toFixed(6);
  const coordsNE = [Number(newPos.getNorthEast().lat().toFixed(6)), Number(newPos.getNorthEast().lng().toFixed(6))];
  this.storyModel.NECoords = new Place('Point', coordsNE);
  // this.storyModel.NECoords = { type : 'Point', coordinates : coordsNE };
  const coordsSW = [Number(newPos.getSouthWest().lat().toFixed(6)), Number(newPos.getSouthWest().lng().toFixed(6))];
  this.storyModel.SWCoords = new Place('Point', coordsSW);
  this.storyModel.shapeType = '';
  this.storyModel.shapeType = this.storyModel.shapeTypeRect;
}


onSubmit(form: any) {
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

  // set the location based on latitude contents
  this.storyModel.loc = new Place('Point', [ Number(this.longitude.value), Number(this.latitude.value) ]);
  console.log('onSubmit $event.file=', event);

  this._storyService.updateStory(this._user, this.storyModel, this.pictures).subscribe( result => this.successfulSubmit(),
    error => this.failedSubmit(<any>error));


}

private successfulSubmit() {
  this.success = true;
  this.resetForm();
  setTimeout(() => {
    this._router.navigate(['/list']);
  }, 2000);

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
  // this.editedStory.photoLinks = null;
  // and close the map
  this.ckMap.setValue(false);
}


  deletePhoto(i) {
   this.log.debug('Button clicked with: ' + i);
   // remove photo
    this.storyModel.photoLinks.splice(i, 1);
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






}
