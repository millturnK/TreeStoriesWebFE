/**
 * Created by evan on 12/6/17.
 */
import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AppConfig {

  config: any = {};
  constructor(private http: Http) {}

  public load() {
    return new Promise((resolve, reject) => {
      this.http.get('/env')
        .map(res => res.json())
        .subscribe(
          data => {
            console.log('got back:', data);
            this.config = data;
            resolve(true);
          },
          error => {
            // reject(error)
            console.log('Config overrides not found, continue anyway...');
            // legitimate for this to be not found under ng serve
            // also I am only using this as an override of the environment file
            // so legitimate for it to be unnecessary.
            resolve(true);
          }
        );
    });
  }
}
