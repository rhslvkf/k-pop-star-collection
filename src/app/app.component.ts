import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  favoriteMenuOpen = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socialSharing: SocialSharing
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#1a9c95');
      this.splashScreen.hide();
    });
  }

  shareApp() {
    let message = 'You can enjoy Youtube, SNS of K-POP Stars in one app.';
    let subject = 'K-POP Star Collection';
    let url = 'https://play.google.com/store/apps/details?id=com.rhslvkf.kpopstarcollection';

    this.socialSharing.share(message, subject, '', url);
  }
}
