import { Component, ViewChild } from '@angular/core';

import { Platform, ModalController, IonContent } from '@ionic/angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  stars: Observable<Star[]>;
  callParentFunction: any;

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private firebaseDB: AngularFireDatabase
  ) {
    this.platform.backButton.subscribe(() => {
      this.dismiss();
    });
    this.stars = this.firebaseDB.list<Star>('stars/list', ref => ref.orderByChild('order'))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            name: c.payload.key, ...c.payload.val()
          }))
        })
      );
  }

  parentInit(starName: string) {
    this.callParentFunction(starName);
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  scrollToTop() {
    this.ionContent.scrollToTop(0);
  }

  logScrolling() {
    let d = document.querySelector('#modal-content #scrollTopBtn') as HTMLElement;
    if (document.querySelector('#modal-content').shadowRoot.querySelector('.inner-scroll').scrollTop >= 200) {
      d.style.display = "block";
    } else if (document.querySelector('#modal-content').shadowRoot.querySelector('.inner-scroll').scrollTop < 200) {
      d.style.display = "none";
    }
  }

}
