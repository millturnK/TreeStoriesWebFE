
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
import {GoogleApiService} from "./tell/services/google-api.service";


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
    routing
    /*,
    AgmCoreModule.forRoot({
      apiKey:"AIzaSyBEtWNCzXeRZdmXGg8XU8zh0JMSbsiEHPA"
    })*/

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
