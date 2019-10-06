import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';

@Injectable({
  providedIn: 'root'
})
export class AdmobfreeService {

  bannerConfig: AdMobFreeBannerConfig = {
    // isTesting: true, // Remove in production
    autoShow: true,
    id: "ca-app-pub-8843457940870268/8256641655"
  };

  interstitialConfig: AdMobFreeInterstitialConfig = {
    // isTesting: true, // Remove in production
    autoShow: false,
    id: "ca-app-pub-8843457940870268/6943559981"
  };

  constructor(
    private admobFree: AdMobFree,
    private platform: Platform
  ) {
    platform.ready().then(() => {
      admobFree.on('admob.interstitial.events.CLOSE').subscribe(() => {
        this.prepareInterstitialAd();
      });
    });
  }

  prepareInterstitialAd() {
    this.admobFree.interstitial.config(this.interstitialConfig);
    return this.admobFree.interstitial.prepare();
  }

  async showInterstitialAd() {
    await this.admobFree.interstitial.isReady();
    return this.admobFree.interstitial.show();
  }

  showBannerAd() {
    this.admobFree.banner.config(this.bannerConfig);
    return this.admobFree.banner.prepare();
  }

  removeBannerAd() {
    return this.admobFree.banner.remove();
  }

}
