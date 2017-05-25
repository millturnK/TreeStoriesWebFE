import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import {TellComponent} from './tell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {GoogleMapsComponent} from './google-maps.component';
//import {TellService} from './services/tell.service';
import {GoogleMapsComponent} from '../home/google-maps/google-maps.component';
import {GoogleMapsModule} from '../home/google-maps/google-maps.module';
import {ImageUploadModule} from 'angular2-image-upload';
import {Story} from '../models/story';
import {StoryService} from '../services/story.service';
import { MapComponent } from './map/map.component';
import {GoogleApiService} from './map/services/google-api.service';

@NgModule({
  declarations: [
    TellComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    ImageUploadModule.forRoot()

    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBEtWNCzXeRZdmXGg8XU8zh0JMSbsiEHPA'
    // })

  ],
  providers: [StoryService, GoogleApiService]
})
export class TellModule { }
