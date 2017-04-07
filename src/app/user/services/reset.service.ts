import {Injectable} from "@angular/core";
import {Http, Response, ResponseOptions, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";

import {User} from "../models/user";

@Injectable()
export class ResetService {


  constructor(private http: Http) { }


  // Now a real implementation using a back-end for authentication
  forgot(emailIn: string): Observable<string> {

    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({ headers: headers});

    let body = JSON.stringify( { email: emailIn } );
    let targetUrl = "api/v1/reset/forgot";

    return this.http.post(targetUrl, body, options)
      .timeout(10000)
      .map(this.extractForgotData)
      .catch(this.handleForgotError);

  }

  private extractForgotData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error("Response status: " + res.status);
    }
    let body = res.json();

    // this doesn't seem to be wrapping the response in a data object???
    // so just returning the body and letting it get mapped to a user object
    return body.status || "";
  }

  private handleForgotError( error: any) {
    // error and return to us so we know about it
    console.log("Forgot failed = ", error);
    let body = error.json();
    console.log("Error body = ", body);
    let errMsg = body.error || "Server error";
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  // Try to retrieve a user's details using a token
  public getUserByToken(token: string): Observable<User> {

    let queryUrl = "api/v1/reset/" + token;

    return this.http.get(queryUrl)
      .map(this.extractData)        // should be able to user this because it just mashes a user json into User object
      .catch(this.handleError);
  }

  public resetPwd(user: User): Observable<User> {
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({ headers: headers});

    let body = JSON.stringify( user );
    let targetUrl = "api/v1/reset";

    return this.http.post(targetUrl, body, options)
      .timeout(10000)
      .map(this.extractData)
      .catch(this.handleError);

  }


  private extractData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error("Response status: " + res.status);
    }
    let body = res.json();

    // this doesn't seem to be wrapping the response in a data object???
    // so just returning the body and letting it get mapped to a user object
    return body || { };
  }

  private handleError( error: any) {
    // TODO consider using a remote logging service to capture this
    // error and return to us so we know about it
    /*console.log("Login failed = ", error);*/
    let body = error.json();
    /*console.log("Error body = ", body);*/
    let errMsg = body.error || "Server error";
    console.error(errMsg);
    return Observable.throw(errMsg);
  }


}
