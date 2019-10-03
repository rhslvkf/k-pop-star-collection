import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

import { MyToastService } from '../service/my-toast.service';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { SqlStorageService } from '../service/sql-storage.service';
import { MENUS } from '../vo/menus';
import { SELECT_STARS, SELECT_STAR_SITES, UPDATE_FAVORITE_STARS, SELECT_STARS_COUNT, SELECT_STARS_COUNT_BY_NAME, SELECT_STARS_BY_NAME } from '../vo/query';
import { Star, Site } from '../vo/star';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  stars: Star[] = [];
  term = "";
  starsCount = 0;
  offset = 0;
  limit = 10;

  constructor(
    private myToastService: MyToastService,
    private statusBar: StatusBar,
    private activatedRoute: ActivatedRoute,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService,
    private appRate: AppRate
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#1a9c95');
      menuToolbarService.changeClass(MENUS.HOME);
    });

    this.setStars_SL();
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

  async setStarsCount(query: string, params: any[]) {
    let data = await this.sqlStorageService.query(query, params);
    this.starsCount = data.res.rows.item(0).starsCount;

    return Promise.resolve();
  }

  setStars_SL() {
    this.stars = [];
    this.offset = 0;
    this.setStarsCount(SELECT_STARS_COUNT, []);
    this.pushStars(SELECT_STARS, [this.offset, this.limit]);
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
    this.ionContent.scrollToTop(500);
  }

  logScrolling() {
    let d = document.querySelector('#home-content #scrollTopBtn') as HTMLElement;
    if (document.querySelector('#home-content').shadowRoot.querySelector('.inner-scroll').scrollTop >= 200) {
      d.style.display = "block";
    } else if (document.querySelector('#home-content').shadowRoot.querySelector('.inner-scroll').scrollTop < 200) {
      d.style.display = "none";
    }
  }

  addFavorite(starName: string) {
    this.myToastService.showToast('Added to favorites');

    for(let i = 0; i < this.stars.length; i++) {
      if(this.stars[i].name == starName) this.stars[i].favoriteFlag = true;
    }

    this.sqlStorageService.query(UPDATE_FAVORITE_STARS, [1, starName]);
  }

  removeFavorite(starName: string) {
    this.myToastService.showToast('Removed from your favorites');

    for(let i = 0; i < this.stars.length; i++) {
      if(this.stars[i].name == starName) this.stars[i].favoriteFlag = false;
    }

    this.sqlStorageService.query(UPDATE_FAVORITE_STARS, [0, starName]);
  }

  loadData(event) {
    setTimeout(() => {
      this.offset += this.limit;
      let term = '%' + this.term + '%';
      this.pushStars(SELECT_STARS_BY_NAME, [term, this.offset, this.limit]);
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
    await this.setStarsCount(SELECT_STARS_COUNT_BY_NAME, [term]);
    if(this.starsCount <= this.limit) {
      this.infiniteScroll.disabled = true;
    }
    this.pushStars(SELECT_STARS_BY_NAME, [term, this.offset, this.limit]);
  }

}
