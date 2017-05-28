/**
 * Created by KatieMills on 27/4/17.
 */

import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Story} from '../models/story';
import {User} from '../user/models/user';
import {AppConsts} from '../app.consts';
import {loggerFactory} from '../config/ConfigLog4j';
import {Picture} from '../models/picture';
import {environment} from '../../environments/environment';

// declare var google: any;



@Injectable()
export class StoryService {


  private apiUrl: string = environment.server_url + '/api/v1/story';



//  private queryUrl = 'http://localhost:3000/api/v1/story';

  private log = loggerFactory.getLogger('service.story');

  constructor(private http: Http) { }


  public postStory(story: Story, pictures: Picture[]): Observable<Story> {

    // const headers = new Headers({'Content-Type': 'application/json'});

    const headers = new Headers();

    // headers.append('x-access-token', user.token);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(story);
    const formData: FormData = new FormData();
    formData.append('title', story.title);
    formData.append('contributors', story.contributors);
    formData.append('sources', story.sources);
    formData.append('content', story.content);
    formData.append('latitude', story.latitude);
    formData.append('longitude', story.longitude);
    formData.append('botName', story.botName);
    // TODO Not available in story yet
    formData.append('links', []);

    // formData.append('test', 'test');
    for (const pic of pictures) {
      formData.append(pic.partName, pic.file);
      console.log('appended image to req', pic.file);
    }

    return this.http.post(this.apiUrl, formData, options)
      .map(this.extractGetData)
      .catch(this.handleError);

  }
  // GET all stories from database
  //public getStories(user: User): Observable<Story[]> {
  public getStories(): Observable<Story[]> {
    const headers = new Headers({'Content-Type': 'application/json'});
    //headers.append('x-access-token', user.token);
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.apiUrl, options)
      .map(this.extractGetData)
      .catch(this.handleError);
  }

  public getStoriesWithinRadiusPoint(point: string): Observable<Story[]> {
    const headers = new Headers({'Content-Type': 'application/json'});
    //headers.append('x-access-token', user.token);
    const options = new RequestOptions({ headers: headers });
    const pointQueryUrl = this.apiUrl + '?' + 'point=' + point;
    this.log.debug('in getStoriesWithinRadiusPoint. queryUrl=' + pointQueryUrl);
    return this.http.get(pointQueryUrl, options)
      .map(this.extractGetData)
      .catch(this.handleError);
  }

  public getUsersStories(user: User): Observable<Story[]> {
    const headers = new Headers({'Content-Type': 'application/json'});
    //headers.append('x-access-token', user.token);
    const options = new RequestOptions({ headers: headers });
    const userQueryUrl = this.apiUrl + '?' + 'user=' + user.username;
    return this.http.get(userQueryUrl, options)
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
