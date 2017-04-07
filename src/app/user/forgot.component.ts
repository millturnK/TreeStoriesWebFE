import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ResetService } from "./services/reset.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "forgot-form",
  providers: [ResetService],
  templateUrl: "forgot.component.html",
  styleUrls: ["login.components.css"]

})

export class ForgotComponent {

  email = new FormControl("", Validators.required);

  forgotForm = new FormGroup({
    email: this.email
  });

  public errorMsg = "";
  public regErrorMsg = "";
  public regSuccess = "";

  success: boolean = false;
  errorMessage: string;
  private toEmail: string;


  constructor(private _service: ResetService, _router: ActivatedRoute) {

  }

  forgot() {
      /*console.log("Forgot request for: ", this.email.value);*/
      this._service.forgot( this.email.value )
                            .subscribe( res => this.successfulForgot(res),
                                        error => this.failedForgot(<any>error));

    }


    private successfulForgot(result: string) {
      /*console.log("Forgot successful: ", result);*/
      this.success = true;
      this.toEmail = this.email.value;
       // give them a message
      this.email.reset("");

    }

     private failedForgot(error: any) {
       /*console.log("Forgot failed: ", error);*/
       this.errorMessage = error;

     }


  onSubmit(form: any): void {

   // clear out my result fields...
   this.success = false;
   this.errorMessage = "";

   this.forgot();

  }


}
