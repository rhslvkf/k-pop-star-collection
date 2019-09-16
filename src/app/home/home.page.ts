import { Component, ViewChild } from '@angular/core';

import { IonContent } from '@ionic/angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoadingService } from '../loading.service';
import { MyToastService } from '../my-toast.service';

export interface Site {
  officialSite: string;
  instagram: string;
  blog: string;
}

export interface Star {
  name?: string;
  order: string;
  updateDate: string;
  sites: Site;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  stars: Observable<Star[]>
  terms = "";
  
  constructor(
    private firebaseDB: AngularFireDatabase,
    private loadingService: LoadingService,
    private myToastService: MyToastService
  ) {
    loadingService.presentLoading();

    this.stars = this.firebaseDB.list<Star>('stars', ref => ref.orderByChild('order'))
      .snapshotChanges()
      .pipe(
        map(changes => {
          loadingService.dismissLoading();
          return changes.map(c => ({
            name: c.payload.key, ...c.payload.val()
          }))
        })
      );
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
