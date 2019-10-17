import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { MyToastService } from './service/my-toast.service';
import { LoadingService } from './service/loading.service';
import { EmailService } from './service/email.service';
import { AppService } from './service/sql/app.service';
import { App } from './vo/app';
import { AdmobfreeService } from './service/admobfree.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  favoriteMenuOpen = false;
  backButtonSubscription: any;
  count = 0;
  app: App;
  remindFlag = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socialSharing: SocialSharing,
    private router: Router,
    private myToastService: MyToastService,
    private loadingService: LoadingService,
    private emailService: EmailService,
    private appService: AppService,
    private appRate: AppRate,
    private admobFreeService: AdmobfreeService,
    private ga: GoogleAnalytics
  ) {
    this.backButtonToExit();

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#1a9c95');
      this.splashScreen.hide();

      this.ga.startTrackerWithId('UA-92208975-3');
    });
  }
  
  backButtonToExit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      this.loadingService.dismissLoading();
      
      let routerUrl = this.router.url;
      this.app = await this.appService.selectAppTable();
      if (routerUrl == '/home') {
        if(!this.app.rateFlag && this.app.executeCount > 0 && this.app.executeCount % 3 == 0 && !this.remindFlag) {
          this.rateApp();
        } else if(this.count == 0) {
          this.count++;
          this.myToastService.showToast('Press again to exit');
          setTimeout(() => {
            this.count = 0;
          }, 3000);
        } else if(this.count > 0) {
          navigator['app'].exitApp();  
        }
      }
    });
  }

  rateApp() {
    this.appRate.preferences = {
      simpleMode: true,
      displayAppName: 'K-POP Star Collection',
      usesUntilPrompt: 5,
      storeAppURL: {
        android: 'market://details?id=com.rhslvkf.kpopstarcollection'
      },
      customLocale: {
        title: 'Do you enjoy %@?',
        message: 'If you enjoy %@, would you mind talking to rate it?',
        cancelButtonLabel: 'No, Thanks', // buttonIndex : 1
        laterButtonLabel: 'Remind Me Later', // buttonIndex : 2
        rateButtonLabel: 'Rate It Now' // buttonIndex : 3
      },
      callbacks: {
        onButtonClicked: (buttonIndex) => {
          if(buttonIndex == 1 || buttonIndex == 3) {
            this.appService.updateAppTable(this.app.rateFlag, 1);
          } else if(buttonIndex == 2) {
            this.remindFlag = true;
          }
        }
      }
    }

    this.appRate.promptForRating(true);
  }

  async shareApp() {
    let message = 'You can enjoy Youtube, SNS of K-POP Stars in one app.';
    let subject = 'K-POP Star Collection';
    let url = 'https://play.google.com/store/apps/details?id=com.rhslvkf.kpopstarcollection';

    await this.admobFreeService.removeBannerAd();
    await this.socialSharing.share(message, subject, '', url);
    await this.admobFreeService.showBannerAd();
  }

  async toDeveloper() {
    await this.emailService.sendEmail('', '');
  }
}
