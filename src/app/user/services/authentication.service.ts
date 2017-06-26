import {Injectable} from '@angular/core';
import {Http, Response, ResponseOptions, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {User} from '../models/user';
import {environment} from '../../../environments/environment';
import {Picture} from '../../models/picture';

@Injectable()
export class AuthenticationService {

  private apiUrl: string = environment.server_url + '/api/v1/users';

  constructor(private http: Http) {}


  login(user: User): Observable<User> {

    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers});

    const body = JSON.stringify( user );
    // let targetUrl = 'api/v1/users/login';
    const targetUrl = this.apiUrl + '/login';

    return this.http.post(targetUrl, body, options)
      .timeout(10000)
      .map(this.extractData)
      .catch(this.handleError);

  // .timeout(10000, new Response( new ResponseOptions({ body: '{'error': 'Timeout exceeded'}'})))


  }

  private extractData(res: Response) {
    if ( res.status < 200 || res.status >= 300 ) {
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
    console.error(errMsg);
    return Observable.throw(errMsg);
  }


  public getAccount(username: string, user: User): Observable<User> {

    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('x-access-token', user.token);
    const options = new RequestOptions({ headers: headers });

//    let queryUrl = 'api/v1/users/' + username;
    const queryUrl = this.apiUrl + '/' + username;

    return this.http.get(queryUrl, options)
      .map(this.extractData)
      .catch(this.handleError);


  }


  public getAccounts(user: User): Observable<User[]> {

    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('x-access-token', user.token);
    const options = new RequestOptions({ headers: headers });

   // const queryUrl = 'api/v1/users';
    const queryUrl = this.apiUrl;

    return this.http.get(queryUrl, options)
      .map(this.extractData)
      .catch(this.handleError);


  }

  public delete(username: string, user: User): Observable<string> {

    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('x-access-token', user.token);
    const options = new RequestOptions({ headers: headers });

    const targetUrl = this.apiUrl + '/' + username;

    return this.http.delete(targetUrl, options)
      .timeout(10000)
      .map(this.extractDeleteData)
      .catch(this.handleDeleteError);

  }

  private extractDeleteData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    const body = res.json();

    // this doesn't seem to be wrapping the response in a data object???
    // so just returning the body and letting it get mapped to a user object
    return body.result || '';
  }

  private handleDeleteError( error: any) {
    // error and return to us so we know about it
    const body = error.json();
    const errMsg = body.error || 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  public updateAccount(account: User, picture: Picture, adminuser: User): Observable<User> {

    // const headers = new Headers({'Content-Type': 'application/json'});
    const headers = new Headers();
    headers.append('x-access-token', adminuser.token);
    const options = new RequestOptions({ headers: headers});

   // const body = JSON.stringify( account );
    const formData: FormData = new FormData();
    formData.append('username', account.username);
    formData.append('firstname', account.firstname);
    formData.append('lastname', account.lastname);
    formData.append('businessName', account.businessName);
    formData.append('paymentOption', account.paymentOption);
    formData.append('password', account.password);
    formData.append('role', account.role);
    formData.append(picture.partName, picture.file);
    const targetUrl = this.apiUrl + '/' + account.username;

    // use put for update
    return this.http.put(targetUrl, formData, options)
      .timeout(10000)
      .map(this.extractData)
      .catch(this.handleError);

  }


}
