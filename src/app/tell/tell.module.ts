import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import {TellComponent} from './tell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {GoogleMapsComponent} from './google-maps.component';
//import {TellService} from './services/tell.service';
import {GoogleMapsComponent} from '../google-maps/google-maps.component';
import {GoogleMapsModule} from '../google-maps/google-maps.module';
import {ImageUploadModule} from 'angular2-image-upload';
import {Story} from '../models/story';
import {StoryService} from '../services/story.service';

@NgModule({
  declarations: [
    TellComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    ImageUploadModule.forRoot()

    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBEtWNCzXeRZdmXGg8XU8zh0JMSbsiEHPA'
    // })

  ],
  providers: [StoryService]
})
export class TellModule { }
