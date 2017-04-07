import { Component } from "@angular/core";
// import {App} from "../app.component";
import { User } from "./models/user";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ResetService } from "./services/reset.service";


function passwordValidator(control: FormControl): { [s: string]: boolean } {

  let pattern = /(?=^.{6,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{";:"?/>.<,])(?!.*\s).*$/;
  //
  return control.value.match(pattern) ? null : {pattern: true};

}

@Component({
  selector: "reset-form",
  providers: [ResetService],
  templateUrl: "reset.component.html",
  styleUrls: ["login.components.css"]

})

export class ResetComponent {

  password = new FormControl("", Validators.compose([Validators.required, passwordValidator]));
  passwordConfirm = new FormControl("", Validators.compose([Validators.required, passwordValidator]));

  resetForm = new FormGroup({
    pwd: this.password,
    pwd2: this.passwordConfirm
  });

  // Use this error message string if the token is dodgy
  public errorMsg = "";

  success: boolean = false;
  // Use this error message string is there is any problem validating the passwords or if the reset fails
  errorMessage: string;

  private tokenid: string;

  public emailAddr: string;

  constructor(private route: ActivatedRoute, private _service: ResetService,
              private _router: Router, private _user: User) { }

  ngOnInit() {

    this.tokenid = this.route.snapshot.params["id"];
    /*console.log("Ensure this reset token corresponds to a user: ", this.tokenid);*/
    // kick off user retrieval from back-end

    this._service.getUserByToken( this.tokenid )
        .subscribe( user => this.successfulSearch(user),
          error => this.failedSearch(<any>error));

  }

  private successfulSearch(user: User) {
    /*console.log("ok, that token is valid for : ", user.firstname);*/

    // clear anything out that is there currently
    this._user.clear();
    // save this
    this._user.resetPasswordToken = this.tokenid;
    this._user.firstname = user.firstname;
    this._user.lastname = user.lastname;

  }

  private failedSearch(error: any) {
    /*console.log("Search failed: ", error);*/
    this.errorMsg = error;
  }




  onSubmit(form: any): void {

    // clear out my result fields...
    this.success = false;
    this.errorMessage = "";

    // make sure the passwords are equal
    if (this.password.value !== this.passwordConfirm.value) {

      this.errorMessage = "The passwords you have provided do not match";

      return;
    }


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
    /*console.log("ok, password reset succeeded : ", user.firstname);*/
    this.success = true;

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

    setTimeout(() => { // 3
      this._router.navigate(["/main"]);
    }, 4000);


  }

  private failedReset(error: any) {
    /*console.log("Reset failed: ", error);*/
    // this.success = false;
    this.errorMsg = error;

  }


}
