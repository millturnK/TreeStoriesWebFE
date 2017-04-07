import {Injectable} from "@angular/core";
import {Http, Response, ResponseOptions, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";

import {User} from "../models/user";

@Injectable()
export class AuthenticationService {


  constructor(private http: Http) {}


  login(user: User): Observable<User> {

    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({ headers: headers});

    let body = JSON.stringify( user );
    let targetUrl = "api/v1/users/login";

    return this.http.post(targetUrl, body, options)
      .timeout(10000)
      .map(this.extractData)
      .catch(this.handleError);

  // .timeout(10000, new Response( new ResponseOptions({ body: "{'error': 'Timeout exceeded'}"})))


  }

  private extractData(res: Response) {
    if ( res.status < 200 || res.status >= 300 ) {
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


  public getAccount(username: string, user: User): Observable<User> {

    let headers = new Headers({"Content-Type": "application/json"});
    headers.append("x-access-token", user.token);
    let options = new RequestOptions({ headers: headers });

    let queryUrl = "api/v1/users/" + username;

    return this.http.get(queryUrl, options)
      .map(this.extractData)
      .catch(this.handleError);


  }


  public getAccounts(user: User): Observable<User[]> {

    let headers = new Headers({"Content-Type": "application/json"});
    headers.append("x-access-token", user.token);
    let options = new RequestOptions({ headers: headers });

    let queryUrl = "api/v1/users";

    return this.http.get(queryUrl, options)
      .map(this.extractData)
      .catch(this.handleError);


  }

  public delete(username: string, user: User): Observable<string> {

    let headers = new Headers({"Content-Type": "application/json"});
    headers.append("x-access-token", user.token);
    let options = new RequestOptions({ headers: headers });

    let targetUrl = "api/v1/users/" + username;

    return this.http.delete(targetUrl, options)
      .timeout(10000)
      .map(this.extractDeleteData)
      .catch(this.handleDeleteError);

  }

  private extractDeleteData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error("Response status: " + res.status);
    }
    let body = res.json();

    // this doesn't seem to be wrapping the response in a data object???
    // so just returning the body and letting it get mapped to a user object
    return body.result || "";
  }

  private handleDeleteError( error: any) {
    // error and return to us so we know about it
    /*console.log("Delete failed = ", error);*/
    let body = error.json();
    /*console.log("Error body = ", body);*/
    let errMsg = body.error || "Server error";
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  public updateAccount(account: User, adminuser: User): Observable<User> {

    let headers = new Headers({"Content-Type": "application/json"});
    headers.append("x-access-token", adminuser.token);
    let options = new RequestOptions({ headers: headers});

    let body = JSON.stringify( account );
    let targetUrl = "api/v1/users/" + account.username;

    // use put for update
    return this.http.put(targetUrl, body, options)
      .timeout(10000)
      .map(this.extractData)
      .catch(this.handleError);

  }


}
