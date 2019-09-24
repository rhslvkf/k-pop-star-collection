import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoadingService } from '../service/loading.service';
import { ModalPage } from '../modal/modal.page';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { SqlStorageService } from '../service/sql-storage.service';
import { SELECT_UPDATE_DATE_BY_TABLE_NAME, INSERT_VLIVE, INSERT_UPDATE_DATE_BY_TABLE_NAME, SELECT_VLIVE } from '../vo/query';

@Component({
  selector: 'app-vlive',
  templateUrl: './vlive.page.html',
  styleUrls: ['./vlive.page.scss'],
})
export class VlivePage implements OnInit {
  vliveUrl: Observable<string>;
  starName = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseDB: AngularFireDatabase,
    private loadingService: LoadingService,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#3cb7bd');

      menuToolbarService.changeClass(MENUS.VLIVE);
    });
  }

  goSelf(starName: string) {
    this.starName = starName;
    this.ngOnInit();
  }

  ngOnInit() {
    this.loadingService.presentLoading();

    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.loadData();
  }

  loadData() {
    this.sqlStorageService.query(SELECT_UPDATE_DATE_BY_TABLE_NAME, ['vlive.' + this.starName]).then(data => {
      this.getUpdateDateVlive_FB().then(updateDateFB => {
        if (data.res.rows.length > 0 && updateDateFB <= data.res.rows.item(0).updateDate) {
          // firebase db와 일치한 경우
          this.setVlive_SL();
        } else {
          // firebase db와 일치하지 않은 경우
          this.syncTwitter_FB_SL(updateDateFB)
          .then(() => this.setVlive_SL())
        }
      });
    });
  }

  setVlive_SL() {
    this.sqlStorageService.query(SELECT_VLIVE, [this.starName]).then(data => {
      if(data.res.rows.length > 0) this.vliveIframeInit(data.res.rows.item(0).vliveUrl);
    });
  }

  vliveIframeInit(vliveUrl: string) {
    if(document.querySelector('#vlive-content iframe')) document.querySelector('#vlive-content iframe').remove();

    // create and insert vlive iframe tag
    let iframe = document.createElement('iframe');
    iframe.scrolling = 'yes';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.src = vliveUrl;

    document.getElementById('vlive-content').appendChild(iframe);

    this.loadingService.dismissLoading();
  }

  getUpdateDateVlive_FB(): Promise<string> {
    let updateDateFB = this.firebaseDB.object<string>('vlive/updateDate').snapshotChanges().pipe(map(res => res.payload.val()));
    
    return new Promise(resolve => {
      updateDateFB.subscribe(res => {
        resolve(res);
      })
    });
  }

  syncTwitter_FB_SL(updateDateFB: string) {
    return new Promise(resolve => {
      this.getVlive_FB().subscribe(vliveUrl => {
        this.insertVlive_SL(vliveUrl)
        .then(() => this.insertUpdateDateVlive_SL(updateDateFB))
        .then(() => resolve());
      });
    });
  }

  getVlive_FB() {
    return this.firebaseDB.object<string>('vlive/list/' + this.starName).snapshotChanges().pipe(map(res => {
      return res.payload.val()
    }));
  }

  insertVlive_SL(vliveUrl: string) {
    return this.sqlStorageService.query(INSERT_VLIVE, [vliveUrl, this.starName]);
  }

  insertUpdateDateVlive_SL(updateDate: string) {
    return this.sqlStorageService.query(INSERT_UPDATE_DATE_BY_TABLE_NAME, ['vlive.' + this.starName, updateDate]);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'search-star-modal',
      component: ModalPage,
      componentProps: {
        'callParentFunction': this.goSelf.bind(this)
      }
    });

    return await modal.present();
  }

}
