import { Component } from "@angular/core";
import {User} from "../user/models/user";
import {Router} from "@angular/router";
import {Story} from "./models/story";
import {Validators, FormControl, FormGroup} from "@angular/forms";
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: "tell",
    templateUrl: "tell.component.html"
})
export class TellComponent {
  // form controls & group needed to unpin this form
  title = new FormControl("", Validators.required);
    story : Story;


  tellStoryForm = new FormGroup({
    title: this.title
  });
    constructor(private router: Router,private _user: User){
        this.story = new Story();
        this.story.contributors = _user.username;
    }

    submit() {
        alert("Implement submit");
    }

    /*locate(){
       // alert("Locate called");
        this.router.navigate(["/locate"]);
    }*/

}
