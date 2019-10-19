import { Component, ViewChild } from '@angular/core';

import { Platform, ModalController, IonContent } from '@ionic/angular';

import { SqlStorageService } from '../service/sql-storage.service';
import { Star } from '../vo/star';
import { SELECT_STARS_NAME } from '../vo/query';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  stars: Star[] = [];
  callParentFunction: any;

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private sqlStorageService: SqlStorageService
  ) {
    this.platform.backButton.subscribe(() => {
      this.dismiss();
    });
    
    this.setStarNames();
  }

  async setStarNames() {
    let data = await this.sqlStorageService.query(SELECT_STARS_NAME);
    for(let i = 0; i < data.res.rows.length; i++) {
      this.stars.push({name: data.res.rows.item(i).name});
    }
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
