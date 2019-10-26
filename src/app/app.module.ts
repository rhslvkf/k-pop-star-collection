import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SqlStorageService } from './service/sql-storage.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SocialSharing,
    SqlStorageService,
    SQLite,
    EmailComposer,
    AppRate,
    AdMobFree,
    GoogleAnalytics,
    ScreenOrientation,
    Insomnia
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
