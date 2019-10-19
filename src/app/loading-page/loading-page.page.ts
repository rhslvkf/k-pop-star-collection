import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController } from '@ionic/angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { SqlStorageService } from '../service/sql-storage.service';
import { StarService } from '../service/sql/star.service';
import { YoutubeService } from '../service/sql/youtube.service';
import { TwitterService } from '../service/sql/twitter.service';
import { FacebookService } from '../service/sql/facebook.service';
import { VliveService } from '../service/sql/vlive.service';
import { AppService } from '../service/sql/app.service';
import { AdmobfreeService } from '../service/admobfree.service';
import { StreamingchartService } from '../service/sql/streamingchart.service';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.page.html',
  styleUrls: ['./loading-page.page.scss'],
})
export class LoadingPagePage {
  progress = '0';

  constructor(
    private router: Router,
    private sqlStorageService: SqlStorageService,
    private starService: StarService,
    private youtubeService: YoutubeService,
    private twitterService: TwitterService,
    private facebookService: FacebookService,
    private vliveService: VliveService,
    private appService: AppService,
    private admobFreeService: AdmobfreeService,
    private streamingchartService: StreamingchartService,
    private menuCtrl: MenuController,
    private ga: GoogleAnalytics
  ) {
    menuCtrl.enable(false);
    this.loading();
  }

  async loading() {
    let startTime = new Date().getTime();
    await this.admobFreeService.prepareInterstitialAd();
    console.log('prepareInterstitialAd', new Date().getTime() - startTime);
    this.progress = '0.1';
    await this.sqlStorageService.initSQL();
    console.log('initSQL', new Date().getTime() - startTime);
    this.progress = '0.2';
    await this.starService.syncStarTable();
    console.log('syncStarTable', new Date().getTime() - startTime);
    this.progress = '0.3';
    await this.youtubeService.syncYoutubeTable();
    console.log('syncYoutubeTable', new Date().getTime() - startTime);
    this.progress = '0.4';
    await this.twitterService.syncTwitterTable();
    console.log('syncTwitterTable', new Date().getTime() - startTime);
    this.progress = '0.5';
    await this.facebookService.syncFacebookTable();
    console.log('syncFacebookTable', new Date().getTime() - startTime);
    this.progress = '0.6';
    await this.vliveService.syncVliveTable();
    console.log('syncVliveTable', new Date().getTime() - startTime);
    this.progress = '0.7';
    await this.appService.syncAppTable();
    console.log('syncAppTable', new Date().getTime() - startTime);
    this.progress = '0.8';
    await this.streamingchartService.syncStreamingChartTable();
    console.log('syncStreamingChartTable', new Date().getTime() - startTime);
    this.progress = '0.9';
    await this.admobFreeService.showBannerAd();
    console.log('showBannerAd', new Date().getTime() - startTime);
    this.progress = '1';
    await this.admobFreeService.showInterstitialAd();
    console.log('showInterstitialAd', new Date().getTime() - startTime);
    this.menuCtrl.enable(true);
    let endTime = new Date().getTime();
    this.ga.trackTiming('Category', endTime - startTime, 'Variable', 'Label');
    await this.router.navigateByUrl('/home', {replaceUrl: true});
  }

}
