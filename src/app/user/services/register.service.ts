import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {User} from "../models/user";

@Injectable()
export class RegistrationService {

  constructor(private http: Http) {}

  // Now a real implementation using a back-end for authentication
  register(user: User): Observable<User> {

    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({ headers: headers});

    let body = JSON.stringify( user );
    let targetUrl = "api/v1/users/register";

    return this.http.post(targetUrl, body, options)
      .timeout(20000)
      .map(this.extractData)
      .catch(this.handleError);

  }

  private extractData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error("Response status: " + res.status);
    }
    let body = res.json();

    // so in here I should be saving the token?
    /*console.log("Successful registration");*/
    // or should I be doing it in the login component???

    return body || { };
  }

  private handleError( error: Response | any ) {
    // TODO consider using a remote logging service to capture this

    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""}. ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);

    /*
    console.log("register error: ", error);
    console.log("error status:", error.status);


    let body = error.json();
    console.log("body = ", body);
    let errMsg = body.err.message || "Server error";
    console.error(errMsg);
    return Observable.throw(errMsg);
    */
  }


}
