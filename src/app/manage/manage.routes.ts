/**
 * Created by evan on 26/05/2017.
 */
import { Routes } from '@angular/router';

import { StoryListComponent } from './list.component';
import {AuthGuardPrivlege} from '../auth.guard.privlege';
import {AuthGuard} from '../auth.guard';
import {TellComponent} from '../tell/tell.component';
import {EditComponent} from './edit/edit.component';


export const ManageRoutes: Routes = [

  {path: 'list', component: StoryListComponent, canActivate: [AuthGuard] },
  {path: 'edit/:id', component: EditComponent, canActivate: [AuthGuard] }

];
