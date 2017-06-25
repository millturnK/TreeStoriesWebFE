import {Component, OnInit} from '@angular/core';
import { User } from './models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetService } from './services/reset.service';


function passwordValidator(control: FormControl): { [s: string]: boolean } {

  const pattern = /(?=^.{6,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{";:"?/>.<,])(?!.*\s).*$/;
  //
  return control.value.match(pattern) ? null : {pattern: true};

}

@Component({
  selector: 'reset-form',
  providers: [ResetService],
  templateUrl: 'reset.component.html',
  styleUrls: ['login.components.css']

})

export class ResetComponent implements OnInit {

  password = new FormControl('', Validators.compose([Validators.required, passwordValidator]));
  passwordConfirm = new FormControl('', Validators.compose([Validators.required, passwordValidator]));

  resetForm = new FormGroup({
    pwd: this.password,
    pwd2: this.passwordConfirm
  });

  // Use this error message string if the token is dodgy
  public errorMsg = '';

  success = false;
  // Use this error message string is there is any problem validating the passwords or if the reset fails
  errorMessage: string;

  private tokenid: string;

  public emailAddr: string;

  // loading flag to toggle when a reset has been requested, so we don't get 'spam clicking'
  loading = false;

  constructor(private route: ActivatedRoute, private _service: ResetService,
              private _router: Router, private _user: User) { }

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

  }

  private failedSearch(error: any) {
    this.errorMsg = error;
  }



  onSubmit(form: any): void {

    // clear out my result fields...
    this.success = false;
    this.errorMessage = '';

    // make sure the passwords are equal
    if (this.password.value !== this.passwordConfirm.value) {

      this.errorMessage = 'The passwords you have provided do not match';

      return;
    }

    // disable the button, put in place the spinner
    this.loading = true;

    this.reset();

  }



  reset() {

     // let userin = new User();
      this._user.password = this.password.value;

      this._service.resetPwd( this._user )
                            .subscribe( res => this.successfulReset(res),
                                        error => this.failedReset(<any>error));

    }





  private successfulReset(user: User) {
    this.success = true;
    this.loading = false;

    // store the important stuff on the global user object
    this._user.firstname = user.firstname;
    this._user.lastname = user.lastname;
    this._user.username = user.username;
    this._user.token = user.token;
    this._user.loggedin = user.loggedin;
    this._user.paymentOption = user.paymentOption;
    this._user.admin = user.admin;

    this.emailAddr = user.username;
    // send them back to the main page, in a few seconds

    // clear out the fields as well
    this.password.setValue('');
    this.passwordConfirm.setValue('');

    setTimeout(() => { // 3
      this._router.navigate(['/main']);
    }, 3000);


  }

  private failedReset(error: any) {
    this.loading = false;
    this.errorMsg = error;


  }


}
