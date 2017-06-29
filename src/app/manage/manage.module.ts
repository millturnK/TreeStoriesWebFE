import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoryListComponent } from './list.component';
import {StoryService} from '../services/story.service';
import {CommonModule} from '@angular/common';
import {ShowComponent} from './show.component';
import {DisplayOnlyMapComponent} from '../map/displayonly-map.component';
import { EditComponent } from './edit/edit.component';
import {ImageUploadModule} from 'angular2-image-upload';
import {InteractiveMapComponent} from '../map/interactive-map/interactive-map.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    StoryListComponent,
    ShowComponent,
    DisplayOnlyMapComponent,
    EditComponent,
    InteractiveMapComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule,
    ImageUploadModule.forRoot(),
    NgbModule
  ],
  providers: [
    StoryService
  ]

})
export class ManageModule { }
