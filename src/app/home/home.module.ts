import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HomeComponent} from './home.component';
//import {GoogleMapsComponent} from '../google-maps/google-maps.component';
import {GoogleMapsModule} from '../google-maps/google-maps.module';
import {GoogleMapsComponent} from '../google-maps/google-maps.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    GoogleMapsModule
  ],
  providers: [

  ]

})
export class HomeModule { }
