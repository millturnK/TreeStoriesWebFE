import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from '../user/models/user';
import {Router} from '@angular/router';
import {Story} from '../models/story';
import {Place} from '../models/Place';
import {Validators, FormControl, FormGroup} from '@angular/forms';
import {loggerFactory} from '../config/ConfigLog4j';
import {Picture} from '../models/picture';
import {StoryService} from '../services/story.service';
import {isUndefined} from 'util';
import {CoordsFromPhoto} from './coordsFromPhoto';
import {ImageUploadModule} from 'angular2-image-upload';

declare const google: any;
declare var jQuery: any;


function latitudeValidator(control: FormControl): { [s: string]: boolean } {

  ////console.log('in lat val. control=', control);
  const pattern =  /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
  return control.value.match(pattern) ? null : {pattern: true};


}
function longitudeValidator(control: FormControl): { [s: string]: boolean } {

  ////console.log('in long val. control=', control);
  const pattern =  /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
  return control.value.match(pattern) ? null : {pattern: true};

}

@Component({
    selector: 'app-tell-form',
    templateUrl: 'tell.component.html'
})
// TODO allow upload of up to 5 photos
export class TellComponent implements OnInit {

  @ViewChild('imgUpload') imgUpload;
  success = false;
  errorMessage = '';
  private log = loggerFactory.getLogger('component.Tell');
  storyModel: Story = new Story();
  pictures: Picture[] = [];
  progBarValue = 0;
  showProgBar = false;
  title = new FormControl('', Validators.required);
  botName = new FormControl('');
  description = new FormControl('', [Validators.required, Validators.minLength(140)]);
  contributor = new FormControl('');
  source = new FormControl('', Validators.required);
  latitude = new FormControl('', latitudeValidator);
  longitude = new FormControl('', longitudeValidator);
  ckMap  = new FormControl('');
  tellStoryForm = new FormGroup({
    title: this.title,
    botName: this.botName,
    description: this.description,
    contributor: this.contributor,
    source: this.source,
    // coordChoice: this.coordChoice,
    latitude: this.latitude,
    longitude: this.longitude,
    ckMap: this.ckMap,
  });

  coordsAttr: Number[] = [];
  // let input = Observable.bindCallback()
  // coordsSubject = new Subject();
  coordsFromPhoto = new CoordsFromPhoto();





  constructor(private router: Router,  private _user: User, private _storyService: StoryService, private elementRef: ElementRef) {
     this.storyModel.contributors = _user.username;
     // set it to Marker as shapetype by default
    this.storyModel.shapeType = this.storyModel.shapeTypeMarker;

  }

  ngOnInit() {

    // enable the tooltips
    jQuery(this.elementRef.nativeElement).find('[data-toggle="tooltip"]').tooltip();
    this.progBarValue = 0;

    this.coordsFromPhoto.coordsSubject.subscribe((
      coords: Number[]) => {
      if (!isUndefined(coords) && coords.length > 0) {
        this.coordsAttr = coords;
        this.latitude.setValue(Number(this.coordsAttr[0]).toFixed(6));
        this.longitude.setValue(Number(this.coordsAttr[1]).toFixed(6));
      }
    });
  }


   // onPositionChanged(newPos: string){
  onPositionChanged(newPos) {
     // set value of text box
     ////console.log('onPosition changed called with', newPos);
     // round to 6 dec places
     this.latitude.setValue(Number(newPos.lat()).toFixed(6));
     this.longitude.setValue(Number(newPos.lng()).toFixed(6));

     this.storyModel.shapeType = '';
    this.storyModel.shapeType = this.storyModel.shapeTypeMarker;
  }
  onRectPositionChanged(newPos) {
      this.log.debug('Yay, I am in onRectPositionChanged. newPos=' + newPos);
      // somehow parse it!
    // bounds=((-29.916852233070163, 139.833984375), (-25.244695951306028, 148.095703125))
    // to get centre call getCentre()
    // to get NW corner call: getNorthEast() and getSouthWest()
    const centre = newPos.getCenter();
    this.latitude.setValue(Number(centre.lat()).toFixed(6));
    this.longitude.setValue(Number(centre.lng()).toFixed(6));
    const centreCoords: number[] = [Number(centre.lng().toFixed(6)), Number(centre.lat().toFixed(6))];
    // const cc2: number[] = [Number('34')., 45];

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

  // Note that location of point or centre pt of rectangle and the NE and SW corners of rect have been set already
  onSubmit(form: any) {

    this.showProgBar = true;
      const title = this.title.value;
      const botName = this.botName.value;
      const description = this.description.value;
      const source = this.source.value;
      const contributor = this.contributor.value;

      this.storyModel.title = title;
      this.storyModel.botName = botName;
      this.storyModel.sources = source;
      this.storyModel.content = description;
      // set long lat as user may have manually entered it - assign it to location
    // need to reverse to store in DB
      this.storyModel.loc = new Place('Point', [ Number(this.longitude.value), Number(this.latitude.value) ]);
      ////console.log('onSubmit $event.file=', event);
      this.progBarValue = 20;
    this._storyService.postStory(this._user, this.storyModel, this.pictures).subscribe( result => this.successfulSubmit(),
      error => this.failedSubmit(<any>error));



    }

  private successfulSubmit() {

    /*////console.log("successful submit");*/
    this.progBarValue = 100;
    this.success = true;
    this.resetForm();
    setTimeout(() => {
      this.progBarValue = 0;
      this.showProgBar = false;
    }, 1000);

    setTimeout(() => {
      this.router.navigate(['/list']);

    }, 2000);


  }


  private resetForm() {

      // manually resetting all the fields. Have seen some funny behaviour when resetting a whole form group
    this.title.reset('');
    this.botName.reset('');
    this.description.reset('');
    this.source.reset('');
    // this.contributor.reset('');
    this.latitude.reset('');
    this.longitude.reset('');

    this.pictures = [];
    // and close the map
    this.ckMap.setValue(false);
   // this.progBarValue = 0;
    //this.imgUpload = null;

  }




  imageUploaded($event) {
    this.log.debug('imageUploaded called');
     ////console.log('imageUploaded called. Event.file:', $event.file);
      // pull out lat.lng
    this.pictures.push(new Picture(<File> $event.file));
    this.coordsFromPhoto.getCoordsFromPhoto($event.file);
  }

  private failedSubmit(error: any) {
    /*////console.log("failedSubmit called: ", error);*/
    this.success = false;
    this.errorMessage = error;
    this.progBarValue = 0;
  }


  // // TODO display map drawing tool accordingly
  // isSingleTree(): boolean {
  //   if (this.coordChoice.value === 'singleTree') {
  //     ////console.log('single tree checked: ', this.coordChoice.value);
  //     return true;
  //   }
  //   return false;
  // }



}
