import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

import { MyToastService } from '../service/my-toast.service';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { SqlStorageService } from '../service/sql-storage.service';
import { MENUS } from '../vo/menus';
import { SELECT_UPDATE_DATE_BY_TABLE_NAME, INSERT_STARS, INSERT_STAR_SITES, INSERT_UPDATE_DATE_BY_TABLE_NAME, SELECT_STARS, SELECT_STAR_SITES } from '../vo/query';

export class Site {
  blog: string;
  instagram: string;
  officialSite: string;

  constructor(blog: string, instagram: string, officialSite: string) {
    this.blog = blog;
    this.instagram = instagram;
    this.officialSite = officialSite;
  }
}

export class Star {
  name: string;
  order?: string;
  updateDate?: string;
  sites: Site;

  constructor(name: string, sites: Site) {
    this.name = name;
    this.sites = sites;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  stars: Star[] = [];
  terms = "";
  
  constructor(
    private firebaseDB: AngularFireDatabase,
    private myToastService: MyToastService,
    private statusBar: StatusBar,
    private activatedRoute: ActivatedRoute,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#1a9c95');
      menuToolbarService.changeClass(MENUS.HOME);
    });
    
    sqlStorageService.initSQL().then(() => {
      this.loadData();
    });
  }

  loadData() {
    this.sqlStorageService.query(SELECT_UPDATE_DATE_BY_TABLE_NAME, ['stars']).then(data => {
      this.getUpdateDateStars_FB().then(updateDateFB => {
        if (data.res.rows.length > 0 && updateDateFB <= data.res.rows.item(0).updateDate) {
          // firebase db와 일치한 경우
          this.setStars_SL();
        } else {
          // firebase db와 일치하지 않은 경우
          this.syncStars_FB_SL(updateDateFB)
          .then(() => this.setStars_SL())
        }
      });
    });
  }

  setStars_SL() {
    this.sqlStorageService.query(SELECT_STARS).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        let star = data.res.rows.item(i);
        this.getStarSites_SL(star.name).then(site => {
          this.stars.push({name: star.name, sites: site});
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

  syncStars_FB_SL(updateDateFB: string) {
    let completeCount = 0;

    return new Promise(resolve => {
      this.getStars_FB().subscribe(stars => {
        stars.forEach(star => {
          this.insertStars_SL(star)
          .then(() => this.insertStarSites_SL(star))
          .then(() => this.insertUpdateDateStars_SL(updateDateFB))
          .then(() => {if(stars.length == ++completeCount) resolve()});
        });
      });
    });
  }

  getUpdateDateStars_FB(): Promise<string> {
    let updateDateFB = this.firebaseDB.object<string>('stars/updateDate').snapshotChanges().pipe(map(res => res.payload.val()));
    
    return new Promise(resolve => {
      updateDateFB.subscribe(res => {
        resolve(res);
      })
    });
  }

  getStars_FB() {
    return this.firebaseDB.list<Star>('stars/list').snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ name: c.payload.key, ...c.payload.val() }))
    }));
  }

  insertStars_SL(star: Star) {
    return this.sqlStorageService.query(INSERT_STARS, [star.name, star.order, star.updateDate]);
  }

  insertStarSites_SL(star: Star) {
    if(star.sites) {
      let blog = star.sites.blog ? star.sites.blog : null;
      let instagram = star.sites.instagram ? star.sites.instagram : null;
      let officialSite = star.sites.officialSite ? star.sites.officialSite : null;

      return this.sqlStorageService.query(INSERT_STAR_SITES, [star.name, blog, instagram, officialSite]);
    }

    return new Promise(resolve => resolve());
  }

  insertUpdateDateStars_SL(updateDate: string) {
    return this.sqlStorageService.query(INSERT_UPDATE_DATE_BY_TABLE_NAME, ['stars', updateDate]);
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
    this.myToastService.showToast('Added to favorites.');
  }

}
