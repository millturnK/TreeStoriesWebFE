import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HomeComponent} from './home.component';
import {GoogleMapsComponent} from './google-maps/google-maps.component';
import {StoryService} from '../services/story.service';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent,
    GoogleMapsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule
  ],
  providers: [
    StoryService
  ]

})
export class HomeModule { }
