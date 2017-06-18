import {Component, Output, EventEmitter, ElementRef, OnInit} from '@angular/core';
import { User } from './models/user';
import { Router } from '@angular/router';
import { RegistrationService } from './services/register.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

declare var jQuery: any;

function passwordValidator(control: FormControl): { [s: string]: boolean } {

    const pattern = /(?=^.{6,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{";:"?/>.<,])(?!.*\s).*$/;
    //
    return control.value.match(pattern) ? null : {pattern: true};
}
function emailValidator(control: FormControl): { [s: string]: boolean } {

    const pattern =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //
    return control.value.match(pattern) ? null : {pattern: true};
}

@Component({
    selector: 'register-form',
    templateUrl: 'register.component.html',
    styleUrls: ['user.components.css'],

})

export class RegisterComponent implements OnInit {

    @Output()
    user: EventEmitter<any> = new EventEmitter();

    // form controls & group needed to unpin this form
    firstname = new FormControl('', Validators.required);
    lastname = new FormControl('', Validators.required);
    email = new FormControl('', Validators.compose([Validators.required, emailValidator]));
    password = new FormControl('', Validators.compose([Validators.required, passwordValidator]));
    passwordConfirm = new FormControl('', Validators.compose([Validators.required, passwordValidator]));
    organisation = new FormControl('');
    paymentplan = new FormControl('IND', Validators.required);

    registerForm = new FormGroup({
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
        passwordConfirm: this.passwordConfirm,
        organisation: this.organisation,
        paymentplan: this.paymentplan
    });

    // none of these used at present.
    public businessName: string;
    public businessAddress: string;
    public businessPostcode: number;
    public businessTelephone: string;

    public regErrorMsg = '';
    public regSuccess = '';

    loading = false;

    constructor(private _router: Router, private _regService: RegistrationService,
                private elementRef: ElementRef) {

    }

    ngOnInit(): any {
        jQuery(this.elementRef.nativeElement).find('[data-toggle="tooltip"]').tooltip();
    }


    onSubmit(form: any): void {

        // clear out my result fields...
        this.regErrorMsg = '';
        this.regSuccess = '';

        // make sure the passwords are equal
       if (this.password.value !== this.passwordConfirm.value) {

            this.regErrorMsg = 'The passwords you have provided do not match';

            return;
        }

        this.register();

    }


    register() {
      let userin = new User;
      userin.username = this.email.value;
      userin.firstname = this.firstname.value;
      userin.lastname = this.lastname.value;
      userin.businessName = this.organisation.value;
      userin.paymentOption = this.paymentplan.value;
      userin.password = this.password.value;
      // by default new users are plebs
      userin.role = User.ROLE_INACTIVE_CD;

        // toggle the loading flag
        this.loading = true;

      this._regService.register( userin )
        .subscribe( userout => this.successfulRegister(userout),
          error => this.failedRegister(<any>error));
    }


  private failedRegister(error: any) {
    console.log('Register failed: ', error);
    this.regErrorMsg = error;
    this.loading = false;

  }


  private successfulRegister(user: User) {

        this.loading = false;
      // need to pass this back
      // Success, so emit
      this.user.emit( user );

      this.regSuccess = 'ok';

      this.firstname.reset('');
      this.lastname.reset('');
      this.email.reset('');
      this.organisation.reset('');


    // All you need to do is use an empty string ''. If you reset like this password.reset() then
    // you are setting the value to null. This fails on the verification.
    this.password.reset('');
    // this.passwordConfirm.updateValueAndValidity('');
    this.passwordConfirm.reset('');



  }



}
