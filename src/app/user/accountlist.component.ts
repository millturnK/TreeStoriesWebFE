/**
 * Created by evan on 24/08/2016.
 * @TO DO: KM am putting approval of NFRS in here but it really needs to be a separate file and both fuctions
 * user and nfr approval in the one page.
 */
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

// user management
import {User} from "./models/user";
import {AuthenticationService} from "./services/authentication.service";

@Component({
  selector: "account-list",
   templateUrl: "accountlist.component.html",
  styleUrls: ["user.components.css"]
})
export class AccountListComponent implements OnInit {

  user: User;
  accounts: User[];
  // nfrs: NFR[];

  deleteCandidate: number;  // index of the user to delete

  // result from a delete
  deleteerror: string;
  deletesuccess: string;

  constructor(private _service: AuthenticationService, private _router: Router, private _user: User) {

    this.user = _user;
  }

  ngOnInit(): any {

    // All good, logged in, so go retrieve all the rated properties
    this.getAccounts();
  }

  private getAccounts() {
    this._service.getAccounts(this.user)
        .subscribe( (results: User[]) => this.successfulRetrieve(results),
            error => this.failedRetrieve(<any>error));
  }

  private successfulRetrieve(users: User[]) {
    this.accounts = users;
  }

  private failedRetrieve(error: any) {
    /*console.log("failed retrieve: ", error);*/

  }

  private edit(user: User) {
    this._router.navigate(["/account", user.username]);

  }

  private delete(idx: number) {
    this.deleteCandidate = idx;

    /*console.log("Delete: ", this.accounts[idx].username);*/
  }

  abandonDelete() {
    /*console.log("I changed my mind ");*/
    this.deleteCandidate = null;
  }

  confirmDelete() {
    /*console.log("Ok, I'm doing it delete: ", this.accounts[this.deleteCandidate].username);*/

    this._service.delete( this.accounts[this.deleteCandidate].username, this.user)
      .subscribe( (result: string) => this.successfulDelete(result),
        error => this.failedDelete(<any>error));


  }

  private successfulDelete(result: string) {
    /*console.log("successful delete: ", result);*/
    // reload the page
    this.deletesuccess = this.accounts[this.deleteCandidate].username;
    this.accounts.splice(this.deleteCandidate, 1);
  }

  private failedDelete(error: any) {
    /*console.log("failed delete: ", error);*/
    this.deleteerror = error;
  }

  refreshAcctList() {
    // console.log("Refresh the list");
    this.getAccounts();
  }

}
