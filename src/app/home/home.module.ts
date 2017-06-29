import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HomeComponent} from './home.component';
import {GoogleMapsComponent} from './google-maps/google-maps.component';
import {StoryService} from '../services/story.service';
import {CommonModule} from '@angular/common';
import {ToolTipModule} from 'angular2-tooltip';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    HomeComponent,
    GoogleMapsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    ToolTipModule,
    RouterModule,
    NgbModule
  ],
  providers: [
    StoryService
  ]

})
export class HomeModule { }
