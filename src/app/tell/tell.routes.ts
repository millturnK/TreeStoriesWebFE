/**
 * Created by KatieMills on 7/4/17.
 */

import { Routes } from "@angular/router";

import { HomeComponent } from "../home/home.component";
import {AuthGuardPrivlege} from "../auth.guard.privlege";
import {AuthGuard} from "../auth.guard";
import {TellComponent} from "../tell/tell.component";
import {StoryListComponent} from '../manage/list.component';
//TODO put in curate component
export const TellRoutes: Routes = [
  { path: "tell", component: TellComponent, canActivate: [AuthGuard] },
  {path: 'list', component: StoryListComponent, canActivate: [AuthGuard] }
]

