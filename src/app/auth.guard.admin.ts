import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { User } from "./user/models/user";

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  // Reference to global user profile
  // not sure this is entirely the best way of doing this but will do for now
  user: User;


  constructor(private router: Router, private _user: User) {

    this.user = _user;

  }

  canActivate(
    // Not using but worth knowing about
    next:  ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    if ( this.user.loggedin && this.user.admin ) { return true; }

    // otherwise route back to home
    this.router.navigate(["/home"]);
    return false;

  }
}
