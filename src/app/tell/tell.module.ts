import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import {TellComponent} from './tell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {AgmCoreModule} from '@agm/core';
//import {GoogleMap} from '@agm/core/services/google-maps-types';
import {GoogleMapsComponent} from './google-maps.component';
import {TellService} from './services/tell.service';

@NgModule({
  declarations: [
    TellComponent,
    GoogleMapsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule

    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBEtWNCzXeRZdmXGg8XU8zh0JMSbsiEHPA'
    // })

  ],
  providers: [TellService]
})
export class TellModule { }
