/**
 * Created by evan on 22/09/2016.
 */
import { Routes } from "@angular/router";

import { HomeComponent } from "./home.component";
import {AuthGuardPrivlege} from "../auth.guard.privlege";
import {AuthGuard} from "../auth.guard";
import {TellComponent} from "../tell/tell.component";
//TODO put in curate component
export const HomeRoutes: Routes = [

  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent }
]
