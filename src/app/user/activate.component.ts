import { Component, ElementRef, OnInit } from '@angular/core';
import { User } from './models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivateService } from './services/activate.service';
import { environment } from '../../environments/environment';

declare var jQuery: any;


@Component({
  selector: 'activate-form',
  providers: [ActivateService],
  templateUrl: 'activate.component.html',
  styleUrls: ['login.components.css']

})

export class ActivateComponent implements OnInit {

  // Use this error message string if the token is dodgy
  public errorMsg = '';

  success = false;
  // Use this error message string is there is any problem with the payment process
  errorMessage: string;
  // use this error message for any problems with the token used
  tokenError: string;

  private tokenid: string;

  constructor(private route: ActivatedRoute, private _service: ActivateService,
              private _router: Router, private _user: User, private elementRef: ElementRef) {

  }

  ngOnInit() {

    this.tokenid = this.route.snapshot.params['id'];

    // kick off user retrieval from back-end

    this._service.getUserByToken( this.tokenid )
        .subscribe( user => this.successfulSearch(user),
          error => this.failedSearch(<any>error));

  }

  private successfulSearch(user: User) {

    // clear anything out that is there currently
    this._user.clear();
    // save this
    this._user.resetPasswordToken = this.tokenid;
    this._user.firstname = user.firstname;
    this._user.lastname = user.lastname;
    this._user.username = user.username;

    // this is all we need.
    this.success = true;


  }

  private failedSearch(error: any) {

    this.tokenError = error;

    // disable the activate button
    jQuery(this.elementRef.nativeElement).find('#activateBtn').prop('disabled', true);

  }

  private finaliseAccount() {

    this._service.finaliseAccount(this.tokenid)
        .subscribe( user => this.successfulCreation(user),
            error => this.failedCreation(<any>error));

  }

  private successfulCreation(user: User) {

    this.success = true;

    // disable the activate button
    jQuery(this.elementRef.nativeElement).find('#activateBtn').prop('disabled', true);

  }

  private failedCreation(error: any) {

    this.success = false;

    if (error === 'Invalid token') {
      this.errorMsg = 'The activation token used in this request isn\'t valid. This is most likely because you\'ve already activated your account.' +
              'Please try and login with the credentials you supplied at registration.';
    } else {
      this.errorMsg = error;

    }

  }


}
