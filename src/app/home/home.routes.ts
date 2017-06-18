/**
 * Created by evan on 22/09/2016.
 */
import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import {AuthGuardPrivlege} from '../auth.guard.privlege';
import {AuthGuard} from '../auth.guard';
import {TellComponent} from '../tell/tell.component';
import {LoginComponent} from '../user/login.component';


export const HomeRoutes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent },
  {path: 'main', component: HomeComponent },
  {path: 'tell', component: TellComponent }

];
