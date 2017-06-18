/**
 * Created by evan on 25/08/2016.
 */
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "./services/authentication.service";
import { User } from "./models/user";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: "account-form",
  templateUrl: "account.component.html",
  styleUrls: ["user.components.css"],

})

export class AccountComponent implements OnInit {

  userRoleOptions = [
    {id: User.ROLE_PLEB_CD, name: User.ROLE_PLEB},
    {id: User.ROLE_SENATOR_CD, name: User.ROLE_SENATOR},
    {id: User.ROLE_INACTIVE_CD, name: User.ROLE_INACTIVE}
  ];

  username = new FormControl("", Validators.required);
  password = new FormControl("", Validators.required);
  firstname = new FormControl("", Validators.required);
  lastname = new FormControl("", Validators.required);
  bizname = new FormControl("");
  bizaddress = new FormControl("");
  bizpostcode = new FormControl("");
  biztel = new FormControl("");
  admin = new FormControl("");
  paymentopt = new FormControl("");
  roleCtrl = new FormControl("");

  accountForm = new FormGroup({
    username: this.username,
    firstname: this.firstname,
    lastname: this.lastname,
    bizname: this.bizname,
    bizaddress: this.bizaddress,
    bizpostcode: this.bizpostcode,
    biztel: this.biztel,
    admin: this.admin,
    paymentopt: this.paymentopt,
    role: this.roleCtrl
  });

  public errorMsg = "";
  public updateerror = "";
  public updatesuccess = "";

  user: User;


  constructor(private route: ActivatedRoute, private _service: AuthenticationService, private _user: User,
              private _router: Router) {

    this.user = _user;
  }


  ngOnInit() {

    // (+) converts string "id" to a number
    let id = this.route.snapshot.params["id"];

    // additional security check required here - if this is a user searching for anything other than themselves
    // then they must be admin
    if (id !== this.user.username && !this.user.admin) {
      // must be admin to do this and your not
      /*console.log("Non admin user attempted to access another user's account. ", this.user.username, id);*/
      this._router.navigate(["/main"]);

    }


    // kick off retrieval from back-end
    // All good, logged in, so go retrieve all the rated properties

    this._service.getAccount(id, this.user)
      .subscribe( (result: User) => this.successfulRetrieve(result),
        error => this.failedRetrieve(<any>error));

  }


  private successfulRetrieve(user: User) {
    /*console.log("Retrieve successful: ", user);*/

    this.firstname.setValue( user.firstname );
    this.lastname.setValue( user.lastname );
    this.username.setValue( user.username );
    this.bizname.setValue( user.businessName );
    this.bizaddress.setValue( user.businessAddress );
    this.biztel.setValue( user.businessTelephone );
    this.bizpostcode.setValue( user.businessPostcode );
    this.paymentopt.setValue( user.paymentOption );
    this.admin.setValue( user.admin );
    this.roleCtrl.setValue( user.role );

  }

  private failedRetrieve(error: any) {
    /*console.log("Retrieve failed: ", error);*/

    this.errorMsg = error;

  }

  onSubmit(form: any): void {
   /* console.log("Update this user");*/

    const userToUpd = new User();
    userToUpd.username = this.username.value;
    userToUpd.firstname = this.firstname.value;
    userToUpd.lastname = this.lastname.value;
    userToUpd.businessName = this.bizname.value;
    userToUpd.businessAddress = this.bizaddress.value;
    userToUpd.businessPostcode = this.bizpostcode.value;
    userToUpd.businessTelephone = this.biztel.value;
    userToUpd.admin = this.admin.value;
    userToUpd.paymentOption = this.paymentopt.value;
    userToUpd.role = this.roleCtrl.value;

    this._service.updateAccount(userToUpd, this.user)
      .subscribe( (result: User) => this.successfulUpdate(result),
      error => this.failedUpdate(<any>error));

  }

  private successfulUpdate(user: User) {
    /*console.log("Update successful: ", user);*/

    this.updatesuccess = user.username;

  }

  private failedUpdate(error: any) {
    /*console.log("Update failed: ", error);*/
    this.updateerror = error;

  }



  private delete() {
    /*console.log("Delete this user");*/
  }

  reset() {
    /*console.log("Reset this user's password");*/
    this._router.navigate(["/forgot"]);

  }


}
