import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../user/models/user";

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
}



