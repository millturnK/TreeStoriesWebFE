import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import {TellComponent} from './tell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {GoogleMapsComponent} from './google-maps.component';
import {TellService} from './services/tell.service';
import {GoogleMapsComponent} from '../google-maps/google-maps.component';
import {GoogleMapsModule} from '../google-maps/google-maps.module';

@NgModule({
  declarations: [
    TellComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    GoogleMapsModule

    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBEtWNCzXeRZdmXGg8XU8zh0JMSbsiEHPA'
    // })

  ],
  providers: [TellService]
})
export class TellModule { }
