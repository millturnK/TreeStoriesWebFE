import { Component, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';


import { User } from './models/user';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {AppConsts} from '../app.consts';


@Component({
    selector: 'app-login-form',
    providers: [AuthenticationService],
    templateUrl: 'login.component.html',
    styleUrls: ['login.components.css']

})

export class LoginComponent {

    appConsts: AppConsts;

    username = new FormControl('', Validators.required);
    password = new FormControl('', Validators.required);

    loginForm = new FormGroup({
        username: this.username,
        password: this.password
    });


    public errorMsg = '';

    constructor(private _router: Router, private _user: User,
                private _service: AuthenticationService, _appConsts: AppConsts) {

        this.appConsts = _appConsts;
    }

    onSubmit(form: any): void {

        const user = new User();
        user.username = this.username.value;
        user.password = this.password.value;

        // clear any existing error
        this.errorMsg = '';

        this._service.login( user )
                            .subscribe( auser => this.successfulLogin(auser),
                                        error => this.failedLogin(<any>error));
    }



    private successfulLogin(user: User) {
        /*//console.log('Login successful: ', user);*/

        this._user.firstname = user.firstname;
        this._user.lastname = user.lastname;
        this._user.username = user.username;
        this._user.token = user.token;
        this._user.loggedin = user.loggedin;
        this._user.paymentOption = user.paymentOption;
        this._user.admin = user.admin;
        this._user.role = user.role;
        this._user.photoLink = user.photoLink;

        // store the user in local storage
        //console.log('Pushing user into localstorage');
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Successful, so route to main webapp page.
        this._router.navigate(['/main']);

    }

     private failedLogin(error: any) {
       //console.log('Login failed: ', error);

       if (error === 'Account inactive') {
           this.errorMsg = 'Your account is inactive. Please complete the registration process first and then login. ' +
                   'As part of registration you should have received an email that contains a link with an activation key. ' +
                   'That link will take you to the payment page';
       } else {
           this.errorMsg = error;
       }


     }






  forgot() {
    /*//console.log('Forgot link clicked');*/
    // send them back to the home page
    this._router.navigate(['/forgot']);

  }



}
