import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import {TellComponent} from './tell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {GoogleMapsComponent} from './google-maps.component';
//import {TellService} from './services/tell.service';
import {GoogleMapsComponent} from '../home/google-maps/google-maps.component';
import {ImageUploadModule} from 'angular2-image-upload';
import {Story} from '../models/story';
import {StoryService} from '../services/story.service';
import { MapComponent } from './map/map.component';
import { GoogleApiService } from '../services/google-api.service';
import {ImageService} from 'angular2-image-upload/lib/image.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


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
    ImageUploadModule.forRoot(),
    NgbModule

    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBEtWNCzXeRZdmXGg8XU8zh0JMSbsiEHPA'
    // })

  ],
  providers: [StoryService, GoogleApiService, ImageService]
})
export class TellModule { }
