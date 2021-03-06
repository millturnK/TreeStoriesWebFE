import {Component, Input, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user/models/user';

declare var jQuery: any;

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    //@Input() user: User;
   // @Input() userPhotoURL;
  userPhotoURL = '../assets/ic_person_white_24dp_1x.png';
  user: User;

   // userPhotoURL = '';

    // tag in html that we are referring to here
    // means no need anymore for jquery.
    //@ViewChild('ddmenu') dropDownMenu: ElementRef;

  constructor(private _router: Router, private _user: User, private elementRef: ElementRef) {
    this.user = _user;


  }

  ngOnInit(): any {

   this.setNewUserPhoto();
    jQuery(this.elementRef.nativeElement).find('.dropdown-toggle')
      .dropdown();



  }
  ngOnDestroy() {
    this.userPhotoURL = '';
  }

  setNewUserPhoto(){
    if (this.user.photoLink) {
      this.userPhotoURL = this.user.photoLink;
    }
    else {
      this.userPhotoURL = '../assets/ic_person_white_24dp_1x.png';
    }
  }
  getPhotoLink(): string {
    if (this.user.photoLink) {
      return this.user.photoLink;
    } else {
      return '../assets/ic_person_white_24dp_1x.png';
    }
  }

  login() {
    // //console.log('Login clicked');
    //this.setNewUserPhoto();
    if (!this.user.loggedin) {

      this._router.navigate(['login']);
    }

  }

  register() {
      // //console.log('Register clicked');
      this._router.navigate(['register']);
    }


    userIsPrivleged(): boolean {

      if (this.user.loggedin && (this.user.role === User.ROLE_SENATOR_CD)) {
        return true;
      }

       return false;

    }

  private edit() {

    // //console.log('Edit called - navigate to user's account:', this.user.username);
    this._router.navigate(['/account', this.user.username]);

  }


}
