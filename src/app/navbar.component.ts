import { Component, Input, ElementRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./user/models/user";
//import * as jQuery from 'jquery';
declare var jQuery: any;
//var jQuery = require("jquery");

@Component({
  selector: "navbar",
  templateUrl: "navbar.component.html",
  styleUrls: ["navbar.component.css"]
})
export class NavbarComponent implements OnInit {

    @Input()
    user: User;

  constructor(private _router: Router, private elementRef: ElementRef) {}

  ngOnInit(): any {
    // Need to pass in the URL to redirect to if not logged in

    jQuery(this.elementRef.nativeElement).find(".dropdown-toggle")
        .dropdown();

  }

  logout() {
    console.log("Logout clicked");

    // remove user from local storage to log user out
    console.log("Dropping user from localstorage");
    localStorage.removeItem("currentUser");

    this.user.clear();

    // send them back to the home page
    this._router.navigate(["home"]);

  }

  login() {
    // console.log("Login clicked");
    if (!this.user.loggedin) {
      this._router.navigate(["login"]);
    }

  }

  register() {
      // console.log("Register clicked");
      this._router.navigate(["register"]);
    }


    userIsPrivleged(): boolean {

       if (this.user.loggedin && (this.user.role === User.ROLE_SENATOR_CD))
         return true;

       return false;

    }

  private edit() {

    // console.log("Edit called - navigate to user's account:", this.user.username);
    this._router.navigate(["/account", this.user.username]);

  }

}
