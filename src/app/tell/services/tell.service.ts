/**
 * Created by KatieMills on 27/4/17.
 */
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {Story} from '../../models/story';
import {User} from '../../user/models/user';
//import any = jasmine.any;
import {AppConsts} from '../../app.consts';
//import {loggerFactory} from "../../../../config/ConfigLog4j";
//import {LFService, LoggerFactoryOptions, LogGroupRule, LogLevel} from "typescript-logging";
//import {loggerFactory} from "../../../../config/ConfigLog4j";

@Injectable()
export class TellService {
  private queryUrl = 'http://localhost:3000/api/v1/story';
  // private factory = LFService.createLoggerFactory(new LoggerFactoryOptions()
  //.addLogGroupRule(new LogGroupRule(new RegExp(".+"), LogLevel.Debug)));
  // private log = this.factory.getLogger("nfrService");
  //private log = loggerFactory.getLogger("model.Product");
  constructor(private http: Http) {
  }

  //@TODO it isn't calling handleError
  //public postStory(user: User, story: Story): Observable<NFR> {

  public postStory(story: Story): Observable<Story> {
    const headers = new Headers({'Content-Type': 'application/json'});
   // headers.append('x-access-token', user.token);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(story);

    return this.http.post(this.queryUrl, body, options)
      .map(this.extractGetData)
      .catch(this.handleError);

  }
  private handleError( error: Response | any ) {
    // TODO consider using a remote logging service to capture this

    //this.log.debug("inside handleError using proper logging");
    //console.log("inside handleError");

    const errMsg = 'Error in tell service';
    //if (error instanceof Response) {
    //   const body = error.json() || "";
    //   const err = body.error || JSON.stringify(body);
    //   errMsg = `${error.status} - ${error.statusText || ""}. ${err}`;
    //
    //   if (error.status === 401 || error.status === 403) {
    //     //this.log.debug("Authorisation error");
    //     errMsg = AppConsts.ERR_401_MSG;
    //   }
    //   if (error.status === 520)
    //   {
    //     //this.log.debug("Duplicate error");
    //     errMsg = AppConsts.ERR_520_MSG;
    //   }
    //   if(error.status === 500)
    //   {
    //     errMsg = AppConsts.ERR_500_MSG;
    //   }
    //
    // } else {
    //
    //   errMsg = error.message ? error.message : error.toString();
    //
    //   //this.log.debug("inside else of log. Got response. ", error.toString());
    // }
    console.error(errMsg);
    return Observable.throw(errMsg);


  }

  private extractGetData(res: Response) {
    if ( res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    const body = res.json();
    // console.log("NFRService: extractGetData.Got response. Details:", body);
    return body || { };
  }

}
