import {Injectable} from "@angular/core";

@Injectable()
export class User {

  // get this back and need to store
  public token: string;
  public username: string;  // this will be their email address
  public password: string;
  public firstname: string;
  public lastname: string;
  public businessName: string;
  public businessAddress: string;
  public businessPostcode: number;
  public businessTelephone: string;
  public paymentOption: string;
  public admin: boolean = false;
  public loggedin: boolean = false;   // logged in = true
  public resetPasswordToken: string;
  public role: string;
  public photoLink: string;

  // returns object to original state = logged out
  public clear() {
    this.token = null;
    this.username = null;
    this.password = null;
    this.firstname = null;
    this.lastname = null;
    this.businessName = null;
    this.businessAddress = null;
    this.businessPostcode = null;
    this.businessTelephone = null;
    this.paymentOption = null;
    this.admin = false;
    this.loggedin = false;
    this.resetPasswordToken = null;
    this.role = null;
    this.photoLink = null;
  }

  // Status
  public static ROLE_PLEB = "Pleb";
  public static ROLE_PLEB_CD = "PB";
  public static ROLE_SENATOR = "Senator";
  public static ROLE_SENATOR_CD = "SR";
  public static ROLE_INACTIVE = "Inactive";
  public static ROLE_INACTIVE_CD = "NONE";





}
