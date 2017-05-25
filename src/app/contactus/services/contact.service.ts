import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Contact} from '../models/contact';

@Injectable()
export class ContactService {

  constructor(private http: Http) { }

  sendMsg(contact: Contact): Observable<Contact> {

    /*console.log("About to send: ", contact);*/

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers});
    // TODO - not sure if this will work or I need the name: name format?
    // Also if I need an observable returned then should I just create an
    // object to carry the message and any response fields?
    let body = JSON.stringify( contact );
    /*console.log("Json stringify result=", body);*/
    //var targetUrl = new Config().BACKEND_BASE_URL + 'api/v1/contact';
    var targetUrl = 'api/v1/contact';
    /*console.log("Sending to targetUrl= ", targetUrl);*/

    return this.http.post(targetUrl, body, options)
      .timeout(20000)
      .map(this.extractData)
      .catch(this.handleError);

  }

  private extractData(res: Response) {
    if( res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    let body = res.json();
    return body.data || { };
  }

  private handleError( error: any) {
    // TODO consider using a remote logging service to capture this
    // error and return to us so we know about it
    /*console.log("Error obj contains: ", error);*/
    let errMsg = error.message || 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }



}
