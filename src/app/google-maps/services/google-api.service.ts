import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBEtWNCzXeRZdmXGg8XU8zh0JMSbsiEHPA&libraries=places&callback=initMap';
//const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBEtWNCzXeRZdmXGg8XU8zh0JMSbsiEHPA&libraries=places';


@Injectable()
export class GoogleApiService {
  private loadMap: Promise<any>;

  constructor(private http: Http) {

    this.loadMap = new Promise((resolve) => {
      window['initMap'] = () => {
        resolve();
      };
      this.loadScript();
    });
  }

  public initMap(): Promise<any> {
    return this.loadMap;
  }

  private loadScript() {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    //script.async = true;

    if (document.body.contains(script)) {
      return;
    }
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
