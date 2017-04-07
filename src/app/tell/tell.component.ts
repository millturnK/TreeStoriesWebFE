import { Component } from "@angular/core";
import {User} from "../user/models/user";
import {Router} from "@angular/router";
import {Story} from "./models/story";


@Component({
    selector: "tell",
    templateUrl: "tell.component.html"
})
export class TellComponent {
    story : Story;
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
