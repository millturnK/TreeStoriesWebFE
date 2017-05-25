import {Injectable} from '@angular/core';
import {Http, Response, ResponseOptions, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {User} from '../models/user';
import {environment} from '../../../environments/environment';

@Injectable()
export class ActivateService {

  private apiUrl: string = environment.server_url + '/api/v1/activate';


  constructor(private http: Http) { }


  // Try to retrieve a user's details using a token
  public getUserByToken(token: string): Observable<User> {

    const queryUrl = this.apiUrl + '/' + token;

//    let queryUrl = 'api/v1/activate/' + token;

    return this.http.get(queryUrl)
      .map(this.extractData)        // should be able to user this because it just mashes a user json into User object
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    const body = res.json();

    // this doesn't seem to be wrapping the response in a data object???
    // so just returning the body and letting it get mapped to a user object
    return body || { };
  }

  private handleError( error: any) {
    // TODO consider using a remote logging service to capture this
    // error and return to us so we know about it
    const body = error.json();
    const errMsg = body.error || 'Server error';
    return Observable.throw(errMsg);
  }


  public finaliseAccount( tokenid: string, paymentToken: string ): Observable<User> {

    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers});

    const body = JSON.stringify( { activateToken: tokenid, paymentToken: paymentToken } );
//    let targetUrl = 'api/v1/activate/pay';
    const targetUrl = this.apiUrl + '/pay';

    return this.http.post(targetUrl, body, options)
        .timeout(10000)
        .map(this.extractPayData)
        .catch(this.handlePayError);

  }


  private extractPayData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    const body = res.json();

    // this doesn't seem to be wrapping the response in a data object???
    // so just returning the body and letting it get mapped to a user object
    return body || { };
  }

  private handlePayError( error: any) {
    // TODO consider using a remote logging service to capture this
    // error and return to us so we know about it
    const body = error.json();
    const errMsg = body.error || 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }


}
