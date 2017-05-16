/**
 * Created by KatieMills on 28/4/17.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {GoogleMapsComponent} from './google-maps.component';
import {GoogleApiService} from './services/google-api.service';
import {StoryService} from './services/story.service';

@NgModule({
  declarations: [
    GoogleMapsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  exports: [
    GoogleMapsComponent
    ],
  providers: [GoogleApiService, StoryService]
})
export class GoogleMapsModule { }
