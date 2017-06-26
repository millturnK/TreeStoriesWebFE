/**
 * Created by evan on 16/09/2016.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";

import {LoginComponent} from "./login.component";
import {ForgotComponent} from "./forgot.component";
import {ResetComponent} from "./reset.component";
import {RegisterComponent} from "./register.component";
import {AuthenticationService} from "./services/authentication.service";
import {RegistrationService} from "./services/register.service";
import {AccountComponent} from "./account.component";
import {AccountListComponent} from "./accountlist.component";
import {RouterModule} from "@angular/router";
import {ActivateComponent} from "./activate.component";
import {ImageUploadModule} from 'angular2-image-upload';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ImageUploadModule.forRoot()],
  declarations: [
    RegisterComponent,
    LoginComponent,
    ForgotComponent,
    ResetComponent,
    AccountComponent,
    AccountListComponent,
    ActivateComponent
  ],
  providers: [
    AuthenticationService,
    RegistrationService
  ],
  exports: [
    RegisterComponent,
    LoginComponent,
    ForgotComponent,
    ResetComponent,
    AccountListComponent,
    AccountComponent,
    ActivateComponent
  ]
})

export class UserModule { }
