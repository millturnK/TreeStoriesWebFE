
import { Routes } from "@angular/router";

import {LoginComponent} from "./login.component";
import {RegisterComponent} from "./register.component";
import {ForgotComponent} from "./forgot.component";
import {ResetComponent} from "./reset.component";
import {AccountListComponent} from "./accountlist.component";
import {AccountComponent} from "./account.component";
import {AuthGuardAdmin} from "../auth.guard.admin";
import {AuthGuard} from "../auth.guard";
import {ActivateComponent} from "./activate.component";

export const UserRoutes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "forgot", component: ForgotComponent },
    { path: "reset/:id", component: ResetComponent },
    { path: "admin", component: AccountListComponent, canActivate: [AuthGuardAdmin] },
    { path: "account/:id", component: AccountComponent, canActivate: [AuthGuard] },
    { path: "activate/:id", component: ActivateComponent },

];