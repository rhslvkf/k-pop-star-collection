import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { SqlStorageService } from 'src/app/service/sql-storage.service';
import { SELECT_FAVORITE_STARS, SELECT_STAR_SITES, UPDATE_FAVORITE_STARS, SELECT_FAVORITE_STARS_COUNT, SELECT_FAVORITE_STARS_BY_NAME, SELECT_FAVORITE_STARS_COUNT_BY_NAME, SELECT_FACEBOOK, SELECT_TWITTER, SELECT_VLIVE } from 'src/app/vo/query';
import { Star, Site } from 'src/app/vo/star';
import { MyToastService } from 'src/app/service/my-toast.service';
import { MenuToolBarService } from 'src/app/service/menu-toolbar.service';
import { MENUS } from 'src/app/vo/menus';
import { AdmobfreeService } from 'src/app/service/admobfree.service';

@Component({
  selector: 'app-star',
  templateUrl: './star.page.html',
  styleUrls: ['./star.page.scss'],
})
export class StarPage implements OnInit {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  stars: Star[] = [];
  term = "";
  starsCount = 0;
  offset = 0;
  limit = 10;
  noFavoriteContents = false;

  constructor(
    private sqlStorageService: SqlStorageService,
    private myToastService: MyToastService,
    private activatedRoute: ActivatedRoute,
    private statusBar: StatusBar,
    private menuToolbarService: MenuToolBarService,
    private ga: GoogleAnalytics,
    private admobFreeService: AdmobfreeService,
    private socialSharing: SocialSharing,
    private inappbrowser: InAppBrowser
  ) {
    this.ga.trackView('FavoriteStarPage');

    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#7d19ff');
      menuToolbarService.changeClass(MENUS.FAVORITE);

      this.setFavoriteStars_SL();
    });
  }

  ngOnInit() {
    this.admobFreeService.showBannerAd();
  }

  async setFavoriteStars_SL() {
    this.stars = [];
    this.offset = 0;
    await this.setStarsCount(SELECT_FAVORITE_STARS_COUNT, []);
    if(this.starsCount == 0) this.noFavoriteContents = true;
    this.pushStars(SELECT_FAVORITE_STARS, [this.offset, this.limit]);
  }

  async setStarsCount(query: string, params: any[]) {
    let data = await this.sqlStorageService.query(query, params);
    this.starsCount = data.res.rows.item(0).starsCount;

    return Promise.resolve();
  }

  pushStars(query: string, params: any[]) {
    this.sqlStorageService.query(query, params).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        let star = data.res.rows.item(i);
        this.getStarSites_SL(star.name).then(site => {
          this.stars.push({name: star.name, sites: site, favoriteFlag: star.favoriteFlag});
        });
      }
    });
  }

  getStarSites_SL(starName: string): Promise<Site> {
    return new Promise(resolve => {
      this.sqlStorageService.query(SELECT_STAR_SITES, [starName]).then(data => {
        let starSites = data.res.rows.item(0);
        if(starSites) {
          let blog = starSites.blog ? starSites.blog : null;
          let instagram = starSites.instagram ? starSites.instagram : null;
          let officialSite = starSites.officialSite ? starSites.officialSite : null;

          return resolve(new Site(blog, instagram, officialSite));
        }

        return resolve(null);
      });
    })
  }

  scrollToTop() {
    this.ionContent.scrollToTop(0);
  }

  logScrolling() {
    let d = document.querySelector('#favorite-stars-content #scrollTopBtn') as HTMLElement;
    if (document.querySelector('#favorite-stars-content').shadowRoot.querySelector('.inner-scroll').scrollTop >= 200) {
      d.style.display = "block";
    } else if (document.querySelector('#favorite-stars-content').shadowRoot.querySelector('.inner-scroll').scrollTop < 200) {
      d.style.display = "none";
    }
  }

  removeFavorite(starName: string) {
    this.myToastService.showToast('Removed from your favorites');

    for(let i = 0; i < this.stars.length; i++) {
      if(this.stars[i].name == starName) this.stars.splice(i, 1);
    }

    this.sqlStorageService.query(UPDATE_FAVORITE_STARS, [0, starName]);
  }

  loadData(event) {
    setTimeout(() => {
      this.offset += this.limit;
      let term = '%' + this.term + '%';
      this.pushStars(SELECT_FAVORITE_STARS_BY_NAME, [term, this.offset, this.limit]);
      if(this.offset + this.limit >= this.starsCount) {
        event.target.disabled = true;
      }
      event.target.complete();
    }, 500);
  }

  async search() {
    this.stars = [];
    this.offset = 0;
    this.infiniteScroll.disabled = false;

    let term = '%' + this.term + '%';
    await this.setStarsCount(SELECT_FAVORITE_STARS_COUNT_BY_NAME, [term]);
    if(this.starsCount <= this.limit) {
      this.infiniteScroll.disabled = true;
    }
    this.pushStars(SELECT_FAVORITE_STARS_BY_NAME, [term, this.offset, this.limit]);
  }

  async shareStar(star: Star) {
    this.ga.trackEvent('Share', 'shareStar');

    let message = `${star.name}`;
    if(star.sites.officialSite) message += `\nofficialSite - ${star.sites.officialSite}`;
    if(star.sites.instagram) message += `\ninstagram - ${star.sites.instagram}`;
    if(star.sites.blog) message += `\nblog - ${star.sites.blog}`;
    let facebook = await this.sqlStorageService.query(SELECT_FACEBOOK, [star.name]);
    if(facebook.res.rows.length > 0) message += `\nfacebook`;
    for(let i = 0; i < facebook.res.rows.length; i++) {
      message += `\n${facebook.res.rows.item(i).userName} - ${facebook.res.rows.item(i).timelineUrl}`;
    }
    let twitter = await this.sqlStorageService.query(SELECT_TWITTER, [star.name]);
    if(twitter.res.rows.length > 0) message += `\ntwitter`;
    for(let i = 0; i < twitter.res.rows.length; i++) {
      message += `\n${twitter.res.rows.item(i).userName} - ${twitter.res.rows.item(i).timelineUrl}`;
    }
    let vlive = await this.sqlStorageService.query(SELECT_VLIVE, [star.name]);
    if(vlive.res.rows.length > 0) message += `\nvlive - ${vlive.res.rows.item(0).vliveUrl}`;

    message += `\n\nK-POP Star Collection - You can enjoy Youtube, SNS, vlive of K-POP Stars in one app.\nhttps://play.google.com/store/apps/details?id=com.rhslvkf.kpopstarcollection`;

    await this.admobFreeService.removeBannerAd();
    await this.socialSharing.share(message, '', '', '');
    await this.admobFreeService.showBannerAd();
  }

  async openSiteInAppBrowser(url: string) {
    await this.admobFreeService.removeBannerAd();
    let iab = this.inappbrowser.create(url, '_blank', 'location=no');

    iab.on('exit').subscribe(event => {
      this.admobFreeService.showBannerAd();
    });
  }

}
