import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Contact} from '../models/contact';
import {environment} from '../../../environments/environment';

@Injectable()
export class ContactService {

  private apiUrl: string = environment.server_url + '/api/v1/contact';


  constructor(private http: Http) { }

  sendMsg(contact: Contact): Observable<Contact> {

    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers});
    const body = JSON.stringify( contact );

    return this.http.post(this.apiUrl, body, options)
      .timeout(20000)
      .map(this.extractData)
      .catch(this.handleError);

  }

  private extractData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    const body = res.json();
    return body.data || { };
  }

  private handleError( error: any) {
    const errMsg = error.message || 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }



}
