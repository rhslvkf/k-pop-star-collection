import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { SqlStorageService } from 'src/app/service/sql-storage.service';
import { SELECT_FAVORITE_STARS, SELECT_STAR_SITES, UPDATE_FAVORITE_STARS } from 'src/app/vo/query';
import { Star, Site } from 'src/app/vo/star';
import { MyToastService } from 'src/app/service/my-toast.service';
import { MenuToolBarService } from 'src/app/service/menu-toolbar.service';
import { MENUS } from 'src/app/vo/menus';

@Component({
  selector: 'app-star',
  templateUrl: './star.page.html',
  styleUrls: ['./star.page.scss'],
})
export class StarPage {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  stars: Star[] = [];
  noFavoriteContents = false;

  constructor(
    private sqlStorageService: SqlStorageService,
    private myToastService: MyToastService,
    private activatedRoute: ActivatedRoute,
    private statusBar: StatusBar,
    private menuToolbarService: MenuToolBarService
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#7d19ff');
      menuToolbarService.changeClass(MENUS.FAVORITE);

      this.setFavoriteStars_SL();
    });
  }

  setFavoriteStars_SL() {
    this.sqlStorageService.query(SELECT_FAVORITE_STARS).then(data => {
      let dataLength = data.res.rows.length;
      if(dataLength == 0) this.noFavoriteContents = true;
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
    this.ionContent.scrollToTop(500);
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

}
