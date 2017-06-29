
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { appRoutingProviders, routing, AUTH_PROVIDERS } from './app.routes';
import { HomeModule } from './home/home.module';
import { ContactUsModule } from './contactus/contactus.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { NavbarComponent } from './navbar.component';
import { User } from './user/models/user';
import { AppConsts } from './app.consts';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TellModule } from './tell/tell.module';
import { GoogleApiService } from './services/google-api.service';
import { ImageUploadModule } from 'angular2-image-upload';
import { ManageModule } from './manage/manage.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppConfig } from './config/app.config';
import {NgbProgressbarConfig} from './config/progressbar-config';

export function appConfigFactory(config: AppConfig) {
  return () => config.load();
}

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
    ManageModule,
    ContactUsModule,
    UserModule,
    RouterModule,
    ReactiveFormsModule,
    routing,
    ImageUploadModule.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [
    User,
    appRoutingProviders,
    AUTH_PROVIDERS,
    AppConsts,
    GoogleApiService,
    NgbProgressbarConfig,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigFactory,
      deps: [AppConfig],
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
