import { Component } from '@angular/core';
import {User} from './user/models/user';
import {AppConsts} from './app.consts';
import {isUndefined} from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User;
  appConsts: AppConsts;

  // Use injection to create the app user.
  constructor(private _user: User, _appConsts: AppConsts) {

    this.user = _user;


    this.appConsts = _appConsts;
    if ( isUndefined(_user.photoLink) || _user.photoLink === '') {
      this.user.photoLink = '../assets/ic_person_white_24dp_1x.png';
    }else {
      this.user.photoLink = _user.photoLink;
    }



    // see if there is already a user in localStorage and use that
    if (localStorage.getItem('currentUser')) {
      const user: User = JSON.parse(localStorage.getItem('currentUser'));

      // need to set the global user object up because what you get from JSON parse is structure only
      this._user.firstname = user.firstname;
      this._user.lastname = user.lastname;
      this._user.username = user.username;
      this._user.token = user.token;
      this._user.loggedin = user.loggedin;
      this._user.paymentOption = user.paymentOption;
      this._user.admin = user.admin;
      this._user.role = user.role;
      if ( isUndefined(user.photoLink) || user.photoLink === '') {
        this._user.photoLink = '../assets/ic_person_white_24dp_1x.png';
      } else {
        this._user.photoLink = user.photoLink;
      }



    }
  }
}

