import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SqlStorageService } from '../service/sql-storage.service';
import { StarService } from '../service/sql/star.service';
import { YoutubeService } from '../service/sql/youtube.service';
import { TwitterService } from '../service/sql/twitter.service';
import { FacebookService } from '../service/sql/facebook.service';
import { VliveService } from '../service/sql/vlive.service';

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
    private vliveService: VliveService
  ) {
    this.loading();
  }

  async loading() {
    await this.sqlStorageService.initSQL();
    this.progress = '0.1';
    await this.starService.syncStarTable();
    this.progress = '0.2';
    await this.youtubeService.syncYoutubeTable();
    this.progress = '0.4';
    await this.twitterService.syncTwitterTable();
    this.progress = '0.6';
    await this.facebookService.syncFacebookTable();
    this.progress = '0.8';
    await this.vliveService.syncVliveTable();
    this.progress = '1';
    await this.router.navigateByUrl('/home', {replaceUrl: true});
  }

}
