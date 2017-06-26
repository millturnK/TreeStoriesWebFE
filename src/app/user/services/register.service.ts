import {Injectable, Optional} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';
import {environment} from '../../../environments/environment';
import {Picture} from '../../models/picture';

@Injectable()
export class RegistrationService {

  private apiUrl: string = environment.server_url + '/api/v1/users';

  constructor(private http: Http) {}


  register(user: User, picture: Picture): Observable<User> {

   // const headers = new Headers({'Content-Type': 'application/json'});
    const headers = new Headers();
    const options = new RequestOptions({ headers: headers});

   // const body = JSON.stringify( user );
    const formData: FormData = new FormData();
    formData.append('username', user.username);
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('businessName', user.businessName);
    formData.append('paymentOption', user.paymentOption);
    formData.append('password', user.password);
    formData.append('role', user.role);
    formData.append(picture.partName, picture.file);
    const targetUrl = this.apiUrl + '/register';

    return this.http.post(targetUrl, formData, options)
      .timeout(20000)
      .map(this.extractData)
      .catch(this.handleError);

  }

  private extractData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    const body = res.json();

    return body || { };
  }

  private handleError( error: Response | any ) {
    // TODO consider using a remote logging service to capture this

    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''}. ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);


  }


}
