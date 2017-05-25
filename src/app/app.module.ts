
import { BrowserModule }  from "@angular/platform-browser";
import { HttpModule }    from "@angular/http";
import { RouterModule } from "@angular/router";
import { appRoutingProviders, routing, AUTH_PROVIDERS } from "./app.routes";
import { HomeModule } from "./home/home.module";
import { ContactUsModule } from "./contactus/contactus.module";
import { AppComponent } from "./app.component";
import { UserModule } from "./user/user.module";
import { NavbarComponent } from "./navbar.component";
import { User } from "./user/models/user";
import {AppConsts} from "./app.consts";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TellModule} from "./tell/tell.module";
import {GoogleApiService} from "./home/google-maps/services/google-api.service";
import {ImageUploadModule} from 'angular2-image-upload';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HomeModule,
    TellModule,
    ContactUsModule,
    UserModule,
    RouterModule,
    ReactiveFormsModule,
    routing,
    ImageUploadModule.forRoot()
  ],
  providers: [
    User,
    appRoutingProviders,
    AUTH_PROVIDERS,
    AppConsts,
    GoogleApiService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
