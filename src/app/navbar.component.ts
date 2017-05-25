import {Component, Input, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnInit {

    @Input()
    user: User;

    // tag in html that we are referring to here
    // means no need anymore for jquery.
    @ViewChild('ddmenu') dropDownMenu: ElementRef;

  constructor(private _router: Router) {}

  ngOnInit(): any {
    // Need to pass in the URL to redirect to if not logged in
    // Look, no jquery, Maximillan is awesome.
    this.dropDownMenu.nativeElement.dropdown();
  }


  login() {
    // console.log('Login clicked');
    if (!this.user.loggedin) {
      this._router.navigate(['login']);
    }

  }

  register() {
      // console.log('Register clicked');
      this._router.navigate(['register']);
    }


    userIsPrivleged(): boolean {

      if (this.user.loggedin && (this.user.role === User.ROLE_SENATOR_CD)) {
        return true;
      }

       return false;

    }

  private edit() {

    // console.log('Edit called - navigate to user's account:', this.user.username);
    this._router.navigate(['/account', this.user.username]);

  }

}
