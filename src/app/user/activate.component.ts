import {Component, ElementRef} from "@angular/core";
import { User } from "./models/user";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ActivateService } from "./services/activate.service";
import {environment} from "../../environments/environment";

declare var jQuery: any;


@Component({
  selector: "activate-form",
  providers: [ActivateService],
  templateUrl: "activate.component.html",
  styleUrls: ["login.components.css"]

})

export class ActivateComponent {

  voucherIDCtrl = new FormControl("");
  paymentplanCtrl = new FormControl("IND", Validators.required);

  activateForm = new FormGroup({
    paymentplan: this.paymentplanCtrl,
    voucher: this.voucherIDCtrl
  });

  // Use this error message string if the token is dodgy
  public errorMsg = "";

  success: boolean = false;
  // Use this error message string is there is any problem with the payment process
  errorMessage: string;
  // use this error message for any problems with the token used
  tokenError: string;

  private tokenid: string;
  private stripePK: string;

  public emailAddr: string;

  constructor(private route: ActivatedRoute, private _service: ActivateService,
              private _router: Router, private _user: User, private elementRef: ElementRef) {

    if (environment.production) {
      this.stripePK = "pk_live_bgeADHqjXiNM518PTu15KAtm";
      console.log("using prod stripe key");
    }
    else {
      console.log("using test stripe key");
      this.stripePK = "pk_test_3mZENLUnR4BdnmIkeKHiTllV";
    }


  }

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
    this._user.username = user.username;

  }

  private failedSearch(error: any) {
    /*console.log("Search failed: ", error);*/
    this.tokenError = error;

    // disable the activate button
    jQuery(this.elementRef.nativeElement).find("#purchaseBtn").prop("disabled", true);

  }




  onSubmit(form: any): void {

    // clear out my result fields...
    this.success = false;
    this.errorMessage = "";


    this.activate();

  }



  activate() {


    }


//  key: "pk_test_3mZENLUnR4BdnmIkeKHiTllV",
// key: "pk_live_bgeADHqjXiNM518PTu15KAtm"

  openCheckout() {
    let handler = (<any>window).StripeCheckout.configure({
      key: this.stripePK,
      locale: "auto",
      token: (token: any) => {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        /*console.log("Was payment taken here?", token.id);*/

        this.finaliseAccount(token.id);

      }
    });

    handler.open({
      name: "SPQR Site",
      description: "SPQR Subscription 1 Year",
      amount: 1000,
      email: this._user.username
    });

  }


  private finaliseAccount(paymentToken: string) {

    this._service.finaliseAccount( this.tokenid, paymentToken )
        .subscribe( user => this.successfulCreation(user),
            error => this.failedCreation(<any>error));

  }

  private successfulCreation(user: User) {

    // clear anything out that is there currently
    // this._user.clear();

    this.success = true;

    // disable the activate button
    jQuery(this.elementRef.nativeElement).find("#purchaseBtn").prop("disabled", true);


  }

  private failedCreation(error: any) {
    /*console.log("User payment failed: ", error);*/
    this.success = false;

    if (error === "Invalid token") {
      this.errorMsg = "The activation token used in this payment request isn't valid. This is most likely because you've already paid." +
              "Please try and login with the credentials you supplied at registration.";
    }
    else {
      this.errorMsg = error;

    }





  }



/*
  private successfulReset(user: User) {
    console.log("ok, password reset succeeded : ", user.firstname);
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
    console.log("Reset failed: ", error);
    // this.success = false;
    this.errorMsg = error;

  }
*/

}
