/**
 * Created by evan on 21/09/2016.
 */
import { Routes, RouterModule } from "@angular/router";

import { HomeRoutes } from "./home/home.routes";
import { ContactUsRoutes } from "./contactus/contactus.routes";
import { UserRoutes } from "./user/user.routes";
import {AuthGuardAdmin} from "./auth.guard.admin";
import {AuthGuard} from "./auth.guard";
import {AuthGuardPrivlege} from "./auth.guard.privlege";
import {TellRoutes} from "./tell/tell.routes";


const appRoutes: Routes = [
    ...HomeRoutes,
    ...ContactUsRoutes,
    ...UserRoutes,
  ...TellRoutes
];

export const appRoutingProviders: any[] = [

];

export const AUTH_PROVIDERS = [AuthGuard, AuthGuardAdmin, AuthGuardPrivlege];


export const routing = RouterModule.forRoot(appRoutes);
