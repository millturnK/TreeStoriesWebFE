import {Component, OnInit} from '@angular/core';
import {User} from '../user/models/user';
import {Router} from '@angular/router';
import {Story} from '../models/story';
import {Validators, FormControl, FormGroup} from '@angular/forms';
import {TellService} from './services/tell.service';
declare const google: any;

@Component({
    selector: 'tell-form',
    templateUrl: 'tell.component.html'
})
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
  errorMessage = "";
 // coordChoiceArea = new FormControl('', Validators.required);

  storyModel: Story = new Story();

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
    constructor(private router: Router, private _user: User, private _tellService: TellService) {
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

    this._tellService.postStory(this.storyModel).subscribe( result => this.successfulSubmit(),
      error => this.failedSubmit(<any>error));

    }

  private successfulSubmit() {

    /*console.log("successful submit");*/
    this.success = true;
    // setTimeout(() => { // 3
    //   this._router.navigate(["/curate"]);
    // }, 4000);
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
