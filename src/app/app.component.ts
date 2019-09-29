import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { MyToastService } from './service/my-toast.service';
import { LoadingService } from './service/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  favoriteMenuOpen = false;
  backButtonSubscription: any;
  count = 0;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socialSharing: SocialSharing,
    private router: Router,
    private myToastService: MyToastService,
    private loadingService: LoadingService
  ) {
    this.backButtonToExit();

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#1a9c95');
      this.splashScreen.hide();
    });
  }

  backButtonToExit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.loadingService.dismissLoading();

      if (this.router.url == '/home' && this.count == 0) {
        this.count++;
        this.myToastService.showToast('Press again to exit');
        setTimeout(() => {
          this.count = 0;
        }, 3000);
      } else if (this.router.url == '/home' && this.count == 1) {
        navigator['app'].exitApp();
      }
    });
  }

  shareApp() {
    let message = 'You can enjoy Youtube, SNS of K-POP Stars in one app.';
    let subject = 'K-POP Star Collection';
    let url = 'https://play.google.com/store/apps/details?id=com.rhslvkf.kpopstarcollection';

    this.socialSharing.share(message, subject, '', url);
  }
}
