import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoryListComponent } from './list.component';
import {StoryService} from '../services/story.service';
import {CommonModule} from '@angular/common';
import {ShowComponent} from './show.component';

@NgModule({
  declarations: [
    StoryListComponent,
    ShowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule
  ],
  providers: [
    StoryService
  ]

})
export class ManageModule { }
