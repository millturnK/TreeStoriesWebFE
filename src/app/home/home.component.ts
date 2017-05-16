import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../user/models/user";

declare const google: any;
@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private _router: Router, private _user: User)
  {

  }


  title = 'Tree Stories';

  //TODO implement only going here if user is logged in
  //TODO implement logging
  openTell()
  {
    console.log("in openTell")
    this._router.navigate(["tell"]);

  }

  //TO DO - put markers on map - do we share one map or can we have two different instances of the component?

}



